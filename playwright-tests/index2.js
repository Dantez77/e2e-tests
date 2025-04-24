let isLight = false;
document.querySelectorAll('.close-btn').forEach(btn =>{
    btn.addEventListener('click', e => {
        e.target.parentElement.style.display = 'none';
    });
});
    var current_menu = 'main_menu';
    var last_section = '';
    var apellidos = 'LOPEZ';
    var nombres = 'MIGUEL';
    var ur = '675171305862494562583151434370773341315876513D3D';
    var uid = 'danq97@gmail.com';

    const toggleTheme = (_isLight) => {
        if (_isLight) {
            $('#dark_style').removeAttr('disabled');
            $('#light_style').attr('disabled', true);
            $('.theme-toggle.dark').show();
            $('.theme-toggle.light').hide();
            $('.slider').addClass('slider-dark-bg');
            $('.slider').removeClass('slider-light-bg');
            localStorage.setItem('azteqTheme', 'dark');
            $('#main_menu .div-tool-2 .b4-txt-tool > img').each((index, el)=>{
                const imgRoute = $( el ).attr('src').split('/');
                imgRoute[2] = 'dark';
                $( el ).attr('src', imgRoute.join('/'));
            });
            $('.footer>img').attr('src', '../img/common/AzteQ-LogotipoBlanco.png')
        } else {
            $('#light_style').removeAttr('disabled');
            $('#dark_style').attr('disabled', true);
            $('.theme-toggle.light').show();
            $('.theme-toggle.dark').hide();
            $('.slider').removeClass('slider-dark-bg');
            $('.slider').addClass('slider-light-bg');
            localStorage.setItem('azteqTheme', 'light');
            $('#main_menu .div-tool-2 .b4-txt-tool > img').each((index, el)=>{
                const imgRoute = $( el ).attr('src').split('/');
                imgRoute[2] = 'light';
                $( el ).attr('src', imgRoute.join('/'));
            });
            $('.footer>img').attr('src', '../img/common/AzteQ-LogotipoNegro.png')
        }

        isLight = !_isLight;
    };

    const loadTheme = () => {
        const storedTheme = localStorage.getItem('azteqTheme') || 'dark';

        if (storedTheme == 'dark') {
            $('#theme-switch').prop('checked', false);
            toggleTheme(true);
            return;
        }

        $('#theme-switch').prop('checked', true);
        toggleTheme(false);

    };
    loadTheme();

    

    function createFormData(image) {
        var formImage = new FormData();
        formImage.append('userImage', image[0]);
        uploadFormData(formImage);
    }

    function uploadFormData(formData) {
        $.ajax({
            url: "../tools/uploadimage.php?t=usr",
            type: "POST",
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                $('#archfoto').attr('src', data);
            }
        });
    }

    function openWindowWithPostRequest(params) {
        var winName = params.nombre_modulo;
        var winURL = './home_module.php';
        var windowoption = 'resizable=yes,height=600,width=800,location=0,menubar=0,scrollbars=1';
        /* var params = { 'param1' : '1','param2' :'2'}; */
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", winURL);
        form.setAttribute("target", '_self');
        for (var i in params) {
            if (params.hasOwnProperty(i)) {
                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = i;
                input.value = params[i];
                form.appendChild(input);
            }
        }
        document.body.appendChild(form);
        /* window.open('', winName); */
        window.open(winURL, '_self');
        form.target = winName;
        form.submit();
        document.body.removeChild(form);
    }

    // Arguments :
    //  verb : 'GET'|'POST'
    //  target : an optional opening target (a name, or "_blank"), defaults to "_self"
    window.io = {
        open: function(verb, url, data, target){
            var form = document.createElement("form");
            form.action = url;
            form.method = verb;
            form.target = target || "_self";
            if (data) {
                for (var key in data) {
                    var input = document.createElement("textarea");
                    input.name = key;
                    input.value = typeof data[key] === "object"
                        ? JSON.stringify(data[key])
                        : data[key];
                    form.appendChild(input);
                }
            }
            form.style.display = 'none';
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
    };

    function call_module(id_modulo, conlic, recno_u, nombre_modulo) {
        var registro = {
            id_modulo: id_modulo,
            nom_empresa: 'MiEmpresa',
            nom_sucursal: 'Oficina central - (01)',
            nombre_modulo: nombre_modulo,
            conlicencia: conlic,
            recno_u: recno_u
        }
        /* openWindowWithPostRequest(registro); */
        io.open( 'POST', 'home_module.php', {"request": registro });

    }

    document.addEventListener("DOMContentLoaded", function() {
        /* Invocar a la rutina autoexec, al iniciar sesion */
        /* $.ajax({
            type: 'POST',
            url: '../tools/autoexec.php',
            success: function (res) {
                dummy = true;
                // alert('Terminado el autoexec');
            },
            error: function (msg1) {
                dummy = false;
                alert(msg1);
            }
        });
        */

    });

    $(function () { // When document ready ...

        mobiscroll.settings = {
            theme: 'ios',
            themeVariant: 'light',
            lang: 'es'
        };

        $('#theme-switch').on("change", () => {
            toggleTheme(isLight);
        })

        $("#drop-area").on('dragenter', function (e) {
            e.preventDefault();
            $(this).css('background', '#BBD5B8');
        });
        $("#drop-area").on('dragover', function (e) {
            e.preventDefault();
        });
        $("#drop-area").on('drop', function (e) {
            $(this).css('background', '#D8F9D3');
            e.preventDefault();
            var image = e.originalEvent.dataTransfer.files;
            createFormData(image);
        });
        $("#drop-area").on('drop', function (e) {
            $(this).css('background', '#D8F9D3');
            e.preventDefault();
            var image = e.originalEvent.dataTransfer.files;
            createFormData(image);
        });

        selcdsuc = $('#cdsuc').mobiscroll().select({
            display: 'bubble',
            placeholder: 'Sucursal',
            touchUi: false,
            disabled: false,
            multiline: 2,
            height: 50,
            data: {
                url: '../tools/sqlselect/1/5071434B413237556E46692B5358385142636C794668412B4B54336E3438626658394779666A515A5634782F4D77576474444C557543686F527863675065616B7559496D6662357657434A705A4F47595062504F6378775447565742472F68646A7A4573574B466F43413166706E4B3954746738677052727A32457A6A59346A58707677536B706B612F2F53465333715945624252513D3D',
                remoteFilter: false,
                touchUi: false,
                dataType: 'jsonp',
                processResponse: function (data) {
                    var i, item, ret = [];
                    if (data) {
                        for (i = 0; i < data.length; i++) {
                            item = data[i];
                            ret.push({
                                value: item.code,
                                text: item.name,
                                html: '<div style=\"font-size:16px;line-height:18px;\">' + item.name + '</div><div style=\"font-size:10px;line-height:12px;\">' + item.code + '</div>'
                            });
                        }
                    }
                    return ret;
                }
            },
            filter: true
        }).mobiscroll('getInst');

        seldbschm = $('#dbschm').mobiscroll().select({
            display: 'bubble',
            placeholder: 'Empresa',
            touchUi: false,
            disabled: false,
            multiline: 2,
            height: 50,
            onSet: function (ev, inst) {
                var theurl = "../tools/getselect/%%empresa%%.twsuc/cdsuc/nomsuc/1/";
                var condic1 = 'recno_empresa=' + inst.getVal();
                var theschema = get_field_from_table('esquema', 'bi4soft_master.usuario_esquema', condic1);

                theurl = theurl.replace("%%empresa%%", theschema);
                selcdsuc.settings.invalid.length = 0;
                selcdsuc.settings.data.url = theurl;
                selcdsuc.setVal('', true);
                selcdsuc.refresh();
                selcdsuc.enable();
            },
            data: {
                url: '../tools/sqlselect/email=\'danq97@gmail.com\'/74413757316E6E47434444505A6C6D587346774E6C454831636C4A736155666E32456D672F7748512F574E476F647674762F45584B413741444A546D7636764E563355714F4F55335A6A797649712B7A636A477550524C6F737279346C4B3263484E53674972584B563239736F5959675761314D3667786B7356694E2B4B38586F6241314E616D333433576E5466713162653377467557776D7247754D6D464B6A374573356C5571582F42793948676A734858333138756F2F734673574C524A566B4F6F7268344438352B4E4B524F2F79796B775A3039756B552F6965645869742B4C3354305179374D413D',
                remoteFilter: false,
                touchUi: false,
                dataType: 'jsonp',
                processResponse: function (data) {
                    var i, item, ret = [];
                    if (data) {
                        for (i = 0; i < data.length; i++) {
                            item = data[i];
                            ret.push({
                                value: item.code,
                                text: item.name,
                                html: '<div style=\"font-size:16px;line-height:18px;\">' + item.name + '</div><div style=\"font-size:10px;line-height:12px;\">' + item.code + '</div>'
                            });
                        }
                    }
                    return ret;
                }
            },
            filter: true
        }).mobiscroll('getInst');

        $.post('../tools/getresolution.php', {width: screen.width, height: screen.height}, function (json) {
            if (json.outcome == 'success') {
                // do something with the knowledge possibly?
            } else {
                alert('Unable to let PHP know what the screen resolution is!');
            }
        }, 'json');

        $("#btnAccount").click(function () {
            /* Desplega menu de funciones relativas a la cuenta:
            1. Cambiar palabra clave
            2 .Configurar cuenta *storage por dispositivo> empresa y sucursal predeterminadas
            3. Cambiar de empresa
            4. Logout
             */
            $(".menu_section").hide();
            $("#alternate_menu").show();
        });

        $("#btnConfig").click(function () {
            /* Desplega menu de funciones relativas a la aplicacion:
            1. Actualizarla
            2 .Verificar base de datos
            3. Agregar o renovar licencias (solo administrador)
             */
            $(".menu_section").hide();
            $("#config_menu").show();
        });

        $("#logout").click(
            function () {
                mobiscroll.confirm({
                    title: 'Logout',
                    message: 'Desea terminar sesión?',
                    okText: 'Si - proceder',
                    cancelText: 'No - Cancelar',
                    callback: function (res) {
                        if (res == true) {
                            call_logout();
                            window.location.href = "../login/index.php"
                        }
                    }
                });
            }
        );

        $(".return2menu").click(function () {
            $(".menu_section").hide();
            $("#main_menu").show(300);
        });

        $("#changepassword").click(function () {
            $(".menu_section").hide();
            $("#u_apellidos").val(apellidos);
            $("#u_nombres").val(nombres);
            $("#pwd_actual").click();
            $("#pwd_actual").focus();
            $("#change_password").show(300);
        });

        $("#pwd_new2").blur(function () {
            pwd_new1 = $("#pwd_new1").val();
            pwd_new2 = $("#pwd_new2").val();
            if (pwd_new1 != pwd_new2) {
                alert("Error al digitar palabra clave. Verifique");
            }

        });
        $("#dochangepassword").click(function () {
            pwd_actual = $("#pwd_actual").val();
            pwd_actual = twcrypt(pwd_actual);
            pwd_new1 = $("#pwd_new1").val();
            pwd_new1 = twcrypt(pwd_new1);
            formData = {current_pwd: pwd_actual, new_pwd: pwd_new1, ur: ur};
            $.ajax({
                url: "../musrgrp/chgpwd.php",
                type: "POST",
                data: formData,
                cache: false,
                success: function (respuesta) {
                    alert(respuesta);
                }
            });
        });

        $("#configureaccount").click(function () {
            $(".menu_section").hide();
            /* Cargar los valores de dbschm y cdsuc */
            var condicion = ''
            var acampitos = get_defaults(ur);
            $("#configure_account").show(300);
        });
        $("#changecompany").click(function () {
            // Redir to change company program
            window.location.href = '../menu/cambiar_empresa.php';
        });
        function get_defaults(ur) {
            var dbschm = $("#dbschm").val();
            var cdsuc = $("#cdsuc").val();
            formData = {ur: ur};
            $.ajax({
                url: "../musrgrp/getusrdefaults.php",
                type: "POST",
                data: formData,
                cache: false,
                success: function (respuesta) {
                    if (respuesta.includes('ERROR')) {
                        $("#dmschm").val('');
                        $("#cdsuc").val('');
                        $("#archfoto").attr('src', '')
                        alert(respuesta);
                    } else {
                        arespuesta = JSON.parse(respuesta);
                        dbschm = arespuesta[0]['idempresa'];
                        seldbschm.setVal(dbschm, true);
                        cdsuc = arespuesta[0]['cdsuc'];
                        selcdsuc.setVal(cdsuc, true);
                        $("#archfoto").attr('src', arespuesta[0]['urlavatar']);
                    }
                }
            });
        }
        function call_logout() {
            $.ajax({
                url: "../menu/logout.php",
                type: "POST",
                cache: false,
                success: function (respuesta) {
                    if (respuesta.includes('ERROR')) {
                        alert(respuesta);
                    }
                }
            });
        }

        $("#dosetdefaults").click(function () {
            var dbschm = $("#dbschm").val();
            var cdsuc = $("#cdsuc").val();
            var urlavatar = $("#archfoto").attr('src');
            formData = {dbschm: dbschm, cdsuc: cdsuc, ur: ur, archfoto: urlavatar};
            $.ajax({
                url: "../musrgrp/setusrdefaults.php",
                type: "POST",
                data: formData,
                cache: false,
                success: function (respuesta) {
                    mobiscroll.toast({
                        message: 'Opciones por defecto han sido guardadas',
                        display: 'top',
                        color: 'success'
                    });
                }
            });
        });

        $(".btn-area").hover(
            function () { // handlerIn
                current_image = $(this).attr('src');
                pospunto = current_image.lastIndexOf('.');
                if (pospunto > 0) {
                    laextension = current_image.substr(pospunto + 1);
                    elnombre = current_image.substr(0, pospunto);
                    elnombre = elnombre.concat('-hover');
                    elnombre = elnombre.concat('.');
                    elnombre = elnombre.concat(laextension);
                    $(this).attr('src', elnombre);
                }

            }, function () { //handlerOut
                current_image = $(this).attr('src');
                elnombre = current_image.replace('-hover', '');
                $(this).attr('src', elnombre);
            }
        );

        $("#updaterepos").click(function () {
            formData = {toalert: true};
            $.ajax({
                url: "../twsync/twactual.php",
                type: "POST",
                data: formData,
                cache: false,
                success: function (respuesta) {
                    alert(respuesta);
                }
            });
        });
                $("#updatedic").click(function () {
                    formData = {toalert: true};
                    $.ajax({
                        url: "../twsync/twactual.php?p=dic",
                        type: "POST",
                        data: formData,
                        cache: false,
                        success: function (respuesta) {
                            alert(respuesta);
                        }
                    });
                });

        $("#licenseadmin").click(function () {
            $(".menu_section").hide();
            $("#adminlicenses").show(300);
        });

    }); // When document ready section