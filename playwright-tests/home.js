let stripe;
let checkout;
let iti;


// Expresiones regulares para validar los campos
const NAME_REGEX = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ ]+$/;
const NAME_EXCEP = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ ]{3,32}$/;

// Precio de los módulos modulo: [anual, semestrual, mensual]
const MODULE_PRICES = {
    af: [120.0, 66.67, 11.76],
    cm: [300.0, 166.67, 29.41],
    cw: [300.0, 166.67, 29.41],
    cxc: [180.0, 100.0, 17.65],
    cxp: [180.0, 100.0, 17.65],
    fw: [240.0, 133.33, 23.53],
    iw: [180.0, 100.0, 17.65],
    pl: [300.0, 166.67, 29.41],
    pr: [240.0, 133.33, 23.53],
    ba: [120.0, 66.67, 11.76]
};

// Precios de stripe "modulo/plan": [mensual, semestral, anual]
let PRICES = {};

const getPrices = async ()=>{
    await $.ajax({
        url: 'stripe/get_prices.php',
        success: (res)=>{
            jsonres = JSON.parse(res);
            PRICES = JSON.parse(jsonres.prices);
            stripe = Stripe(jsonres.pkey);
        },
        error: (res)=>{
            alert("Ocurrió un error obteniendo los datos");       
        }
    });
}

// Función que muestra el mensaje de error
const showError = (form, message) => {
    $(`${form} .alertMessage`).show().html(message);
    setTimeout(() => {
        $(`${form} .alertMessage`).hide();
    }, 8000);
};

//Funcion para guardar datos en formato json de contactanos
const guardarDesripcion = () => {
    const form = "#contact-form";
    const name = $("#name").val();
    const email = $("#email").val();
    const company = $("#company").val();
    const message = $("#message").val();
    let phone = $("#phone").val();

    var errorStr = "";

    //Verificaciones de las entradas
    if (!name || !email || !phone || !company) {
        errorStr = "Por favor, completa todos los campos.";
    } else if (!NAME_REGEX.test(name)) {
        errorStr = "El nombre solo puede contener letras y espacios.";
        $("#name").addClass("contact-form-item-val");
    } else if (!$("#email")[0].checkValidity()) {
        errorStr = "Por favor, introduce un correo electrónico válido.";
        $("#email").addClass("contact-form-item-val");
    } else if (!iti.isValidNumberPrecise()) {
        errorStr = "Número de teléfono inválido.";
        $("#phone").addClass("contact-form-item-val");
    } else if (!NAME_EXCEP.test(name)) {
        errorStr = "El nombre debe contener entre 3 y 32 caracteres.";
        $("#name").addClass("contact-form-item-val");
    } else if (name.split(" ").length < 2){
        errorStr = "Por favor ingrese su nombre completo";
        $("#name").addClass("contact-form-item-val");
    }
    if (errorStr) {
        showError(form, errorStr);
        return;
    }

    phone = iti.getNumber();

    // Agrega un nuevo objeto con los datos del formulario al array jsonObject

    let jsonObject = {
        email: email,
        telef1: phone,
        nombrec: company,
        nota: message + " Nombre: " + name,
    };

    //Post hacia endpoint
    $.ajax({
        type: "POST",
        url: "https://azteq.club/azteq/admin/prospecto",
        data: jsonObject,
        crossDomain: true,
        success: () => {
            $(`${form} .alertMessage2`)
                .css("display", "block")
                .html("Los datos fueron enviados correctamente.");

            // Ocultar la alerta
            setTimeout(function () {
                $(".alertMessage" && ".alertMessage2").hide();
            }, 5000);

            $("#name").val("");
            $("#email").val("");
            $("#phone").val("");
            $("#company").val("");
            $("#message").val("");

            fbq("track", "Lead");
        },
    });
};

//Funcion para guardar datos de la inscripcion
const guardarInscripcion = (popupNum, trial) => {
    const form = `#form_registro${popupNum}`;

    let billing = 0;
    // Los popupNum menores a 5 son la selección de pago anual (posición 2 en el arreglo de precios)
    if (popupNum <= 4) {
        billing = 2;
    }else if( popupNum > 4 && popupNum <= 8){
        // Los popupnum entre 5 y 8 son la sección de pago semestral  (posición 1 en el arreglo de precios)
        billing = 1;
    }else{
        // Los popupnum mayores que 8 son la sección de pago mensual (posición 0 en el arreglo de pagos)
        billing = 0;
    }

    // Se obtienen los módulos seleccionados
    const modulos = $.map($(`input[name='modulo${popupNum}']:checked`), (e) => {
        return $(e).val();
    });

    errorType = "";

    //Verificaciones de las entradas
    if (modulos.length == 0) {
        errorType = "noModulos";
    }

    switch (errorType) {
        case "noModulos":
            showError(form, "Seleccione al menos un módulo para continuar");
            return;
    }

    let selectedPlan = "";
    // Se guarda el plan seleccionado basado en el número de popup
    switch (popupNum % 4) {
        case 1:
            //popup 1, 5 ó 9
            selectedPlan = "fact";
            break;
        case 2:
            //popup 2, 6 ó 10
            selectedPlan = "serv";
            break;
        case 3:
            //popup 3, 7 u 11
            selectedPlan = "comerc";
            break;
        case 0:
            //popup 4, 8 ó 12
            selectedPlan = "modulos";
            break;
        default:
            showError(form, "Ha ocurrido un error obteniendo la información");
            return;
    }

    if (trial) {
        window.location.href = `free-trial.html?modulos=${selectedPlan != 'modulos' ? selectedPlan : modulos}&billing=${billing}`;
        return;
    }
    $(`#send-signup${popupNum}`).prop("disabled", true); // Desactiva el botón
    $(`#prueba-gratis${popupNum}`).prop("disabled", true); // Desactiva el botón

    iniciarCheckout(popupNum, modulos, selectedPlan, billing);
};

/* 
    Función para obtener el formulario de pago de stripe
    Recibe el popup que se ha abierto, los modulos seleccionados y el periodo de facturación
*/
const iniciarCheckout = async (popupNum, modulos, selectedPlan, billing) => {
    if (typeof checkout !== "undefined" && checkout !== null && !checkout.embeddedCheckout.isDestroyed) {
        checkout.destroy();
    }

    const form = `#form_registro${popupNum}`;

    const frame = $(`${form} + .checkout-frame`);

    let prices = [];
    let modules = [];
    if (selectedPlan != "modulos") {
        prices = [PRICES[selectedPlan][billing]];
        modules = [selectedPlan];
    } else {
        prices = modulos.map((m) => PRICES[m][billing]);
        modules = modulos;
    }

    data = {
        priceID: prices,
        modulos: modules,
    };

    const fetchClientSecret = async () => {
        const response = await fetch("stripe/checkout.php", {
            method: "POST",
            body: JSON.stringify(data),
        });
        const { clientSecret } = await response.json();
        return clientSecret;
    };

    checkout = await stripe.initEmbeddedCheckout({
        fetchClientSecret,
    });

    //Mount Checkout
    checkout.mount(`${form} + .checkout-frame`);

    $(`${form}`).hide();
    frame.show();
};

$(async () => {
    await getPrices();
    // Bindings de los botones de adquirir planes
    for (let i = 1; i <= 12; i++) {
        $(`#send-signup${i}`).on("click", (e) => {
            guardarInscripcion(i.toString(), false);
        });

        $(`#prueba-gratis${i}`).on("click", (e) => {
            guardarInscripcion(i.toString(), true);
        });
    }

    $(".checkout-frame").hide();

    // Binding del botón de contacto
    $("#send").on("click", () => {
        guardarDesripcion();
    });

    //Cambiar la vista de campos vacíos
    $(".contact-form-item").on("focusout", (event) => {
        input = $(event.target);
        if (input.val() === "") {
            input.addClass("contact-form-item-val");
        } else {
            input.removeClass("contact-form-item-val");
        }
    });

    // Limpiar campos de inscripción
    $(".signup-btn").on("click", () => {
        $(".select-all-btn").val('Seleccionar todos');
        $(".signup-total").html(`Total: $0.00`);
        $("input[name=modulo4], input[name=modulo8], input[name=modulo12]").prop("checked", false);
        $(".checkout-frame").hide();
        $(".signup-form").show();
        $(".contact-form-btn, .free-trial").attr("disabled", false);
    });

    // Mostrar el total de la selección anual
    $("#form_registro4").on("change", ":checkbox", () => {
        const form = $("#form_registro4");
        const selected = form.find(":checked")
        if (selected.length <= 0) {
            $(".select-all-btn").val('Seleccionar todos');
        }else if(selected.length >= 10){
            $(".select-all-btn").val('Deseleccionar todos');
        }
        let total = selected.toArray().reduce((a, b) => a + MODULE_PRICES[b.value][0], 0);
        form.children(".signup-total").html(`Total: $${total} (Pago anual)`);
    });

    // Mostrar el total de la selección semestral
    $("#form_registro8").on("change", ":checkbox", () => {
        const form = $("#form_registro8");
        const selected = form.find(":checked")
        if (selected.length <= 0) {
            $(".select-all-btn").val('Seleccionar todos');
        }else if(selected.length >= 10){
            $(".select-all-btn").val('Deseleccionar todos');
        }
        let total = selected.toArray().reduce((a, b) => a + MODULE_PRICES[b.value][1], 0);
        total = total.toFixed(2);
        form.children(".signup-total").html(
            `Total: $${total}  (Pago semestral)`
        );
    });

    // Mostrar el total de la selección mensual
    $("#form_registro12").on("change", ":checkbox", () => {
        const form = $("#form_registro12");
        const selected = form.find(":checked")
        if (selected.length <= 0) {
            $(".select-all-btn").val('Seleccionar todos');
        }else if(selected.length >= 10){
            $(".select-all-btn").val('Deseleccionar todos');
        }
        let total = selected.toArray().reduce((a, b) => a + MODULE_PRICES[b.value][2], 0);
        total = total.toFixed(2);
        form.children(".signup-total").html(
            `Total: $${total}  (Pago mensual)`
        );
    });

    // Seleccionar y deseleccionar todos
    $(".select-all-btn").on("click", (e) => {
        const btn = $(e.target);
        const checkboxes = btn.parent().parent().find("input[type=checkbox]");
        if (btn.val() == "Seleccionar todos") {
            checkboxes.prop("checked", true);
            checkboxes.trigger("change");
            $(e.target).val("Deseleccionar todos");
        } else {
            checkboxes.prop("checked", false);
            checkboxes.trigger("change");
            $(e.target).val("Seleccionar todos");
        }
    });

    if (iti != null) {
        iti.destroy();
    }

    // Inicialización de input de teléfono
    const phoneInput = document.querySelector("#phone");
    iti = intlTelInput(phoneInput, {
        initialCountry: "auto",
        geoIpLookup: (callback) => {
            fetch("https://ipapi.co/json")
                .then((res) => res.json())
                .then((data) => callback(data.country_code))
                .catch(() => callback("sv"));
        },
        dropdownContainer: document.body,
        utilsScript:
            "https://cdn.jsdelivr.net/npm/intl-tel-input@23.8.1/build/js/utils.js",
    });
});
