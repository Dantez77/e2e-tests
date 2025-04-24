// Espera a que el documento esté completamente cargado
$(document).ready(function () {
    // Enfoca el input de usuario al cargar
    $("#username").focus();
  
    // Configuración global para Mobiscroll
    mobiscroll.settings = {
      theme: "ios",
      themeVariant: "light",
      lang: "es", // Idioma español
    };
  
    // Inicializa selector de sucursal (cdsuc)
    selcdsuc = $("#cdsuc")
      .mobiscroll()
      .select({
        touchUi: false,
        filter: true,
        placeholder: "Seleccione ...",
        data: {
          url: "./seleccionasuc.php",
          dataType: "json",
        },
        maxWidth: 300,
      })
      .mobiscroll("getInst"); // Guarda instancia para posterior manipulación
  
    // Inicializa selector de empresa
    selempresa = $("#empresa")
      .mobiscroll()
      .select({
        touchUi: false,
        placeholder: "Seleccione ...",
        filter: true,
        data: {
          url: "./seleccionaempresa.php?action=select",
          dataType: "json",
        },
        // Al seleccionar una empresa se actualiza el selector de sucursal
        onSet: function (ev, inst) {
          var theurl = "./seleccionasuc.php?action=select&empresa=%%THISVALUE%%";
          var thisvalue = "'" + inst.getVal() + "'";
          theurl = theurl.replace("'%%THISVALUE%%'", thisvalue);
          theurl = theurl.replace("%%THISVALUE%%", thisvalue);
          selcdsuc.settings.invalid.length = 0;
          selcdsuc.settings.data.url = theurl;
  
          // Obtiene primer sucursal asociada a la empresa
          mysuc = get_first_cdsuc(thisvalue);
          if (mysuc == null) {
            selcdsuc.setVal("", true);
          } else {
            selcdsuc.setVal(mysuc, true);
          }
  
          selcdsuc.refresh(); // Refresca datos del selector
          selcdsuc.enable(); // Habilita selector
        },
        maxWidth: 300,
      })
      .mobiscroll("getInst"); // Guarda instancia
  
    // Evento de click en botón de login (primera pantalla)
    $("#goLogin1").click(function () {
      let mUsername = $("#username").val();
      let mPassword = $("#password").val();
      var registro = { usr: mUsername, pwd: mPassword };
  
      // Envía credenciales para validación
      $.ajax({
        type: "POST",
        url: "./vrfyaccess.php",
        data: registro,
        success: function (data, status) {
          respuesta = JSON.parse(data);
          empresa_default = 0;
          sucursal_default = "";
  
          // Si credenciales son válidas
          if (respuesta["valido"] == "true") {
            mUsername = $("#username").val();
            $("#username2").html(mUsername); // Muestra nombre
  
            // Establece avatar si está disponible
            if (typeof respuesta["urlavatar"] != "undefined") {
              $("#avatar").attr("src", respuesta["urlavatar"]);
            }
  
            // Asigna valores predeterminados si existen
            if (typeof respuesta["empresa_default"] != "undefined") {
              empresa_default = respuesta["empresa_default"];
            }
            if (typeof respuesta["sucursal_default"] != "undefined") {
              sucursal_default = respuesta["sucursal_default"];
            }
  
            // Oculta login1 y muestra login2
            $("#login1").hide();
            $("#login2").show();
            $("#goLogin2").focus();
  
            // Si solo hay una empresa disponible
            if (respuesta["nempresas"] == 1) {
              selempresa.setVal(respuesta["empresa1"], true);
              selempresa.refresh();
              selempresa.disable(); // Empresa fija
  
              // Si también hay solo una sucursal
              if (respuesta["nsucs"] == 1) {
                aData = {
                  action: "setsuc",
                  recno: respuesta["empresa1"],
                  cdsuc: respuesta["cdsuc"],
                };
                setsuc(aData); // Redirige
              } else {
                // Carga select de sucursales asociadas
                var theurl =
                  "./seleccionasuc.php?action=select&empresa=" +
                  respuesta["empresa1"];
                var thisvalue = "'" + respuesta["empresa1"] + "'";
                theurl = theurl.replace("'%%THISVALUE%%'", thisvalue);
                theurl = theurl.replace("%%THISVALUE%%", thisvalue);
                selcdsuc.settings.invalid.length = 0;
                selcdsuc.settings.data.url = theurl;
                selcdsuc.setVal(sucursal_default, true);
                selcdsuc.refresh();
                selcdsuc.enable();
              }
            } else {
              // Si hay varias empresas
              selempresa.setVal(empresa_default, true);
              selempresa.refresh();
              var theurl =
                "./seleccionasuc.php?action=select&empresa=" + empresa_default;
              var thisvalue = "'" + respuesta["empresa1"] + "'";
              theurl = theurl.replace("'%%THISVALUE%%'", thisvalue);
              theurl = theurl.replace("%%THISVALUE%%", thisvalue);
              selcdsuc.settings.invalid.length = 0;
              selcdsuc.settings.data.url = theurl;
              selcdsuc.refresh();
              selcdsuc.enable();
              selcdsuc.setVal(sucursal_default, true);
            }
  
            // Muestra mensaje de bienvenida
            welcomeMsg = "Bienvenid@ " + respuesta["nombre_usuario"];
            $("#bienvenido").html(welcomeMsg);
  
            urlavatar = respuesta["urlavatar"];
          } else {
            // Si credenciales son inválidas
            mobiscroll.toast({
              message: "ID o password incorrecto(s)",
              display: "center",
              color: "danger",
            });
            $("#password").focus();
          }
        },
        // Manejo de errores de conexión
        error: function (msg1) {
          if (typeof msg1 == "object") {
            themsg = msg1.statusText;
            alert(themsg);
          } else {
            alert("Problema: " + msg1);
          }
        },
      });
    });
  
    // Botón "¿Olvidó su contraseña?" (muestra formulario de recuperación)
    $("#recupera_pwd").click(function () {
      $("#login1").hide();
      $("#login3").show();
    });
  
    // Botón para enviar correo de recuperación
    $("#recuperar").click(function () {
      correo = $("#correo_usr").val();
      $("#recuperar").attr("disabled", true);
      $("#cancelar").attr("disabled", true);
      if (correo) {
        $.ajax({
          type: "POST",
          url: "./check_correo.php",
          data: { correo: correo },
          success: (response) => {
            if (response.includes("[ERROR]")) {
              mobiscroll.toast({
                message: `${response}`,
                display: "center",
                color: "danger",
              });
            } else {
              mobiscroll.toast({
                message: `${response}`,
                display: "center",
                color: "success",
              });
              $("#login3").hide();
              $("#envia_correo").show();
            }
          },
        });
      } else {
        mobiscroll.toast({
          message: "Ingrese su correo",
          display: "center",
          color: "danger",
        });
      }
    });
  
    // Botón cancelar recuperación
    $("#cancelar").click(() => {
      $("#login3").hide();
      $("#login1").show();
    });
  
    // Botón para volver al login desde el mensaje de correo enviado
    $("#login").click(() => {
      $("#envia_correo").hide();
      $("#login1").show();
    });
  
    // Confirmación final de login con empresa y sucursal
    $("#goLogin2").click(function () {
      let mCdSuc = $("#cdsuc").val();
      let nRecno = $("#empresa").val();
      if (mCdSuc == "" || nRecno == 0) {
        mobiscroll.toast({
          message: "Debe definir Empresa y sucursal",
          display: "center",
          color: "danger",
        });
      } else {
        $.post(
          "./seleccionasuc.php",
          {
            action: "setsuc",
            cdsuc: mCdSuc,
            recno: nRecno,
          },
          async function (data, status) {
            if (data == ".T.") {
              $("#loader").fadeIn();
  
              // Espera antes de redirigir
              await delay(100);
  
              window.location.href = "../menu/index.php";
            } else {
              if (data.includes("ERROR")) {
                alert(data);
              } else {
                alert(status);
              }
            }
          },
          "text"
        );
      }
    });
  
    // Presionar Enter en password activa login
    $("#password").keypress(function (event) {
      var keycode = event.keyCode ? event.keyCode : event.which;
      if (keycode == "13") {
        $("#goLogin1").click();
      }
    });
  
    // Función para obtener la primera sucursal asociada a una empresa
    function get_first_cdsuc(recno) {
      var laexpresion = "get_first_cdsuc( " + recno + " )";
      let laurl =
        "../tools/callfunction.php?dbr=" + recno + "&expresion=" + laexpresion;
      let respuesta = "";
      $.ajax({
        type: "GET",
        url: laurl,
        async: false, // Sincrónica, bloquea
        success: function (resp) {
          respuesta = resp;
        },
        error: function () {
          // Error silenciado
        },
      });
      return respuesta;
    }
  
    // Función para confirmar selección de sucursal y redirigir
    function setsuc(aData) {
      $.post(
        "./seleccionasuc.php",
        aData,
        async function (data, status) {
          if (data == ".T.") {
            window.location.href = "../menu/index.php";
          } else {
            alert(status);
          }
        },
        "text"
      );
    }
  });
  