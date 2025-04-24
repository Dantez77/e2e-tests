<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv='cache-control' content='no-cache'>
    <meta http-equiv='expires' content='0'>
    <meta http-equiv='pragma' content='no-cache'>
	
   <title>Compras</title>
    <link href="../lib/css/b.tabs.css" rel="stylesheet">
    <link rel="icon" type="image/png" href="/azteq/img/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/azteq/img/favicon/favicon.svg" />
    <link rel="shortcut icon" href="/azteq/img/favicon/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/azteq/img/favicon/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="AzteQ" />
<link rel="manifest" href="/azteq/img/favicon/site.webmanifest" />
    <link href="../lib/bootstrap-4.6.0-dist/css/bootstrap.min.css" rel="stylesheet">

    <script src="../lib/js/jquery-3.4.1.js"></script>
    <script src="../lib/js/popper.min.js"></script>
    <script src="../lib/bootstrap-4.6.0-dist/js/bootstrap.min.js"></script>

    <script src="../lib/mobiscroll4/js/mobiscroll.jquery.min.js"></script>
    <link href="../lib/mobiscroll4/css/mobiscroll.jquery.min.css" rel="stylesheet" type="text/css">

    <script src="../lib/js/parsley.min.js"></script>
    <link href="../lib/css/parsley.css" rel="stylesheet">
    <script src="../lib/i18n/parsley/es.js"></script>
    <script src="../lib/js/b.tabs.js"></script>

    <link href="../lib/css/b4s-1-0.css" rel="stylesheet">
    <link href="../lib/css/mod-com-light.css" rel="stylesheet">
    <link href="../lib/css/b4s-light.css" rel="stylesheet">
    <link id="dark_style" href="../lib/css/home_module_dark.css" rel="stylesheet">
    <link id="light_style" href="../lib/css/home_module_light.css" rel="stylesheet" disabled="true">

</head>

<style>

.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 30px;
    margin: 0;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

.slider-dark-bg {
    background-color: #000;
}

.slider-light-bg {
    background-color: #eeeeee;
}

.slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: rgb(0, 128, 128);
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

input:focus+.slider {
    box-shadow: 0 0 1px #1f79c2;
}

input:checked+.slider:before {
    -webkit-transform: translateX(22px);
    -ms-transform: translateX(22px);
    transform: translateX(22px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

.toggle-container {
    width: auto;
    height: 30px;
}

.theme-toggle.light {
    position: absolute;
    display: none;
    top: 0px;
    left: 4px;
}

.theme-toggle.dark {
    position: absolute;
    top: 0px;
    right: 4px;
}

</style>
<body class="backg-body">
<div class="container-fluid bck-page">
    <div class="row bckg-top">
        <div class="col-auto mr-auto">

            <div class="row" style="margin-right:0.3rem;">
                <!--Logo B4S-->
                <div class="col-auto pt-2 pr-0 xs-hd" id="image-wrapper">
                <a href=./menu.php>
                    <img src="../img/common/LogoBlancoQ.png"  id="image" width="35" height="35" alt=""/>
                    <img src="../img/common/back.png"  id="image-hover" width="35" height="35" alt=""/>
                   </a>
                </div>

                 <!--<div class ="col-auto pt-2 pr-0 xs-hd" >
                  <a href=./menu.php> <img src="https://static.vecteezy.com/system/resources/previews/010/157/862/non_2x/house-and-home-icon-symbol-sign-free-png.png" width="30" height="30"/></a>
                </div>-->


                <!--Nombre de la empresa y sucursal-->
                <div class="col col-auto pt-2">
                    <div class="b4-client-name pl-2">MiEmpresa</div>
                    <div class="b4-sucurs-name pl-2">Oficina central - (01)</div>
                </div>    <!--END nombre y sucursal-->

             

            </div> <!-- end row-->


        </div>
        <div class="col-auto">
            <div class="row pr-4 align-items-center">

                  <!--<div class="btn btn-corrc div-btn-app">
                    <img src="../img/common/dashboard-icon-gray.png" width="35" height="auto" alt=""/>
                </div> --->
                <div class="toggle-container">
                    <label class="switch">
                        <input type="checkbox" id="theme-switch">
                        <span class="slider round slider-dark-bg"></span>
                        <div class="theme-toggle light">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M9.99994 3.15V0H7.99994V3.15C8.65994 3.01667 9.33994 3.01667 9.99994 3.15Z" fill="#596C7D"></path>
                                <path d="M5.57011 4.15018L3.34012 1.93018L1.93011 3.34018L4.15011 5.57018C4.54031 5.02043 5.02037 4.54037 5.57011 4.15018Z" fill="#596C7D"></path>
                                <path d="M4.15011 12.4302L1.93011 14.6602L3.34012 16.0702L5.57011 13.8502C5.02037 13.46 4.54031 12.9799 4.15011 12.4302Z" fill="#596C7D"></path>
                                <path d="M16.0701 3.34018L13.8501 5.57018C13.4599 5.02043 12.9799 4.54037 12.4301 4.15018L14.6601 1.93018L16.0701 3.34018Z" fill="#596C7D"></path>
                                <path d="M3.14994 8C3.08649 8.32963 3.05302 8.66433 3.04994 9C3.05302 9.33567 3.08649 9.67037 3.14994 10H-6.10352e-05V8H3.14994Z" fill="#596C7D"></path>
                                <path d="M12.4301 13.8502L14.6601 16.0702L16.0701 14.6602L13.8501 12.4302C13.4599 12.9799 12.9799 13.46 12.4301 13.8502Z" fill="#596C7D"></path>
                                <path d="M7.99994 18.0001V14.8501C8.65994 14.9834 9.33994 14.9834 9.99994 14.8501V18.0001H7.99994Z" fill="#596C7D"></path>
                                <path d="M14.85 10H18V8H14.85C14.9834 8.66 14.9834 9.34 14.85 10Z" fill="#596C7D"></path>
                                <path d="M12.96 9.00004C12.96 11.1871 11.187 12.96 8.99998 12.96C6.81293 12.96 5.03998 11.1871 5.03998 9.00004C5.03998 6.81299 6.81293 5.04004 8.99998 5.04004C11.187 5.04004 12.96 6.81299 12.96 9.00004Z" fill="#596C7D"></path>
                            </svg>
                        </div>
                        <div class="theme-toggle dark">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.07789 4.23647L2.94737 2.60253L5.63368 2.52672L6.52631 0L7.41894 2.52672L10.1053 2.60253L7.97473 4.23647L8.74105 6.81373L6.52631 5.28928L4.31158 6.81373L5.07789 4.23647ZM1.38105 9.47522L1.90735e-06 8.42242L1.73474 8.3803L2.31579 6.73793L2.89684 8.3803L4.63158 8.42242L3.25053 9.47522L3.74737 11.1429L2.31579 10.1574L0.884211 11.1429L1.38105 9.47522ZM2.8077 12.9645C1.82182 12.9645 0.876353 12.7884 1.23978e-05 12.4654C1.14847 15.6934 4.187 18 7.75481 18C12.3085 18 16 14.2426 16 9.60757C16 5.97604 13.7339 2.88325 10.5625 1.71428C10.8799 2.60627 11.0529 3.56862 11.0529 4.57211C11.0529 9.20712 7.36139 12.9645 2.8077 12.9645Z" fill="#E8E8E8"></path>
                            </svg>
                        </div>
                    </label>
                </div>
            </div>
            <!-- end botones derecha-->
        </div>

        <!--Botones derecha-->
        <!-- <div class="col-auto">
            <div class="row">
                <div class="col-auto div-btn-app p-1">
                    <div class="btn-dashboard"></div>
                </div>

                <button type="button" class="btn btn-corrc div-btn-app" data-toggle="modal" data-target="#exampleModal">
                    <img src="../img/common/apps-icon.png" class="btn-app" alt=""/>
                </button>
            </div>
            
        </div> -->
        <!-- End botones derecha-->


        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-sm modal-dialog-scrollable justify-content-center">
                <div class="modal-content" style="max-width: 283px;">


                    <button type="button" class="close text-right mr-2" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><img src="../img/common/cierre-icon.png" width="15" height="15"
                                                      alt=""/></span>
                    </button>

                    <div class="modal-body cjl" style="max-height:380px;">
                        <div class="container-fluid">

                            <div class="row row-cols-3 justify-content-center">

                                <div class="col-4 cjl-div-tool b4-btn-tool-cjl justify-content-center">
                                    <a href="#">
                                        <div>
                                            <div class="b4-tit-cajl colr-ven mt-0">
                                                <center>
                                                    <div class="btn-ven-cajl mb-2"></div>
                                                </center>
                                                Ventas
                                            </div>
                                        </div>
                                    </a>
                                </div>

                                <div class="col-4 cjl-div-tool b4-btn-tool-cjl justify-content-center">
                                    <a href="#">
                                        <div>
                                            <div class="b4-tit-cajl colr-comp mt-0">
                                                <center>
                                                    <div class="btn-com-cajl mb-2"></div>
                                                </center>
                                                Compras
                                            </div>
                                        </div>
                                    </a>
                                </div>

                                <div class="col-4 cjl-div-tool b4-btn-tool-cjl justify-content-center">
                                    <a href="#">
                                        <div>
                                            <div class="b4-tit-cajl colr-invent mt-0">
                                                <center>
                                                    <div class="btn-inv-cajl mb-2"></div>
                                                </center>
                                                Inventario
                                            </div>
                                        </div>
                                    </a>
                                </div>


                                <div class="col-4 cjl-div-tool b4-btn-tool-cjl justify-content-center">
                                    <a href="#">
                                        <div>
                                            <div class="b4-tit-cajl colr-cobr mt-0">
                                                <div style="text-align: center;">
                                                    <div class="btn-cob-cajl mb-2"></div>
                                                </div>
                                                Cobros
                                            </div>
                                        </div>
                                    </a>
                                </div>

                                <div class="col-4 cjl-div-tool b4-btn-tool-cjl justify-content-center">
                                    <a href="#">
                                        <div>
                                            <div class="b4-tit-cajl colr-pag mt-0">
                                                <center>
                                                    <div class="btn-pag-cajl mb-2"></div>
                                                </center>
                                                Pagos
                                            </div>
                                        </div>
                                    </a>
                                </div>

                                <div class="col-4 cjl-div-tool b4-btn-tool-cjl justify-content-center">
                                    <a href="#">
                                        <div>
                                            <div class="b4-tit-cajl colr-nom mt-0">
                                                <center>
                                                    <div class="btn-nom-cajl mb-2"></div>
                                                </center>
                                                Nómina
                                            </div>
                                        </div>
                                    </a>
                                </div>


                                <div class="col-4 cjl-div-tool b4-btn-tool-cjl justify-content-center">
                                    <a href="#">
                                        <div>
                                            <div class="b4-tit-cajl colr-conta mt-0">
                                                <center>
                                                    <div class="btn-conta-cajl mb-2"></div>
                                                </center>
                                                Contabilidad
                                            </div>
                                        </div>
                                    </a>
                                </div>


                                <div class="col-4 cjl-div-tool b4-btn-tool-cjl justify-content-center">
                                    <a href="#">
                                        <div>
                                            <div class="b4-tit-cajl colr-bank mt-0">
                                                <center>
                                                    <div class="btn-bank-cajl mb-2"></div>
                                                </center>
                                                Bancos
                                            </div>
                                        </div>
                                    </a>
                                </div>


                                <div class="col cjl-div-tool b4-btn-tool-cjl justify-content-center">
                                    <a href="#">
                                        <div>
                                            <div class="b4-tit-cajl colr-afij mt-0">
                                                <center>
                                                    <div class="btn-afijo-cajl mb-2"></div>
                                                </center>
                                                Activo Fijo
                                            </div>
                                        </div>
                                    </a>
                                </div>


                                <div class="col-4 cjl-div-tool b4-btn-tool-cjl justify-content-center">
                                    <a href="#">
                                        <div>
                                            <div class="b4-tit-cajl colr-atec mt-0">
                                                <center>
                                                    <div class="btn-atec-cajl mb-2"></div>
                                                </center>
                                                Área Técnica
                                            </div>
                                        </div>
                                    </a>
                                </div>

                                <div class="col-4 cjl-div-tool b4-btn-tool-cjl justify-content-center">
                                    <a href="#">
                                        <div>
                                            <div class="b4-tit-cajl colr-help mt-0">
                                                <center>
                                                    <div class="btn-help-cajl mb-2"></div>
                                                </center>
                                                Ayuda
                                            </div>
                                        </div>
                                    </a>
                                </div>


                            </div>
                        </div>

                    </div>    <!-- Fin de row  & container tools-->

                </div>
            </div>
        </div>

    </div>


    <!--/*  /////Titular para móvil//////*/-->
    <div class="row xs-sh">
        <div class="col col-auto pt-2" style="display: inline-block;">
            <div class="btn-tit"></div>
        </div>

        <div class="col col-auto pt-2" style="display: inline-block;">
            <div class="modname clr-mod-10 Xs-Sh">Compras</div>
        </div>
    </div>


<div id="mainFrameTabs">

    <!-- Nav tabs -->
    <ul class="row nav nav-tabs align-items-center pl-4 backg-pestanas" role="tablist">

    </ul>

    <!-- Tab panes -->
    <div class="row b4-page justify-content-center">
        <div class="tab-content row b4-container-tools justify-content-around mt-3">

        </div>
    </div>


</div>





<div class="footer">
    <img src="../img/common/AzteQ-LogotipoBlanco.png" alt="AzteQ" />
</div>
</div>
</body>
<script>
var isLight = false;
var maxId = 0;
var id_modulo = 'cm';
var recno_u = 155 ;
var html_menu = `<div class="row b4-page justify-content-center">     <div id="area-cm" class="row b4-container-tools justify-content-around">
        
                    <div class="row">
                <a href="#" onclick="gendiv('../scrmaedet/scrmaedet.php?scr=cm_compras_loc&mod=cm', 'Compras locales');">
                    <div class="col-4 col-sm-auto b4-btn-tool div-tool">
                        <div class="b4-txt-but-tool colr-comp mt-2">
                            <center>
                                <div class="btn-area mb-2" style="background-image: url('../img/light/com/compras_icon.png');">  </div>
                            </center>
                    Compras locales
                    </div>
                    </div>
                </a>
            </div>                    <div class="row">
                <a href="#" onclick="gendiv('../scrmaedet/scrmaedet.php?scr=cm_comprase&mod=cm', 'Compras a sujetos excluidos');">
                    <div class="col-4 col-sm-auto b4-btn-tool div-tool">
                        <div class="b4-txt-but-tool colr-comp mt-2">
                            <center>
                                <div class="btn-area mb-2" style="background-image: url('../img/light/com/comp_suj_ex_icon.png');">  </div>
                            </center>
                    Compras a sujetos excluidos
                    </div>
                    </div>
                </a>
            </div>                    <div class="row">
                <a href="#" onclick="gendiv('../scrmaestro/scrmaestro.php?scr=cm_poliza&mod=cm', 'Pólizas de importación');">
                    <div class="col-4 col-sm-auto b4-btn-tool div-tool">
                        <div class="b4-txt-but-tool colr-comp mt-2">
                            <center>
                                <div class="btn-area mb-2" style="background-image: url('../img/light/com/poliza_imp_icon.png');">  </div>
                            </center>
                    Pólizas de importación
                    </div>
                    </div>
                </a>
            </div>                    <div class="row">
                <a href="#" onclick="gendiv('../scrmaedet/scrmaedet.php?scr=cm_compras_ext&mod=cm', 'Compras al exterior');">
                    <div class="col-4 col-sm-auto b4-btn-tool div-tool">
                        <div class="b4-txt-but-tool colr-comp mt-2">
                            <center>
                                <div class="btn-area mb-2" style="background-image: url('../img/light/com/compex_icon.png');">  </div>
                            </center>
                    Compras al exterior
                    </div>
                    </div>
                </a>
            </div>                    <div class="row">
                <a href="#" onclick="gendiv('../scrblank/scrblank.php?scr=cm_retaceo&mod=cm', 'Retaceo de costos');">
                    <div class="col-4 col-sm-auto b4-btn-tool div-tool">
                        <div class="b4-txt-but-tool colr-comp mt-2">
                            <center>
                                <div class="btn-area mb-2" style="background-image: url('../img/light/com/retaceo_icon.png');">  </div>
                            </center>
                    Retaceo de costos
                    </div>
                    </div>
                </a>
            </div><div style="width: 100%;"> <hr/> </div>                    <div class="row">
                <a href="#" onclick="gendiv('../scrmaestro/scrmaestro.php?scr=cm_mnprov&mod=cm', 'Proveedores');">
                    <div class="col-4 col-sm-auto b4-btn-tool div-tool">
                        <div class="b4-txt-but-tool colr-comp mt-2">
                            <center>
                                <div class="btn-area mb-2" style="background-image: url('../img/light/com/proveedoresc_icon.png');">  </div>
                            </center>
                    Proveedores
                    </div>
                    </div>
                </a>
            </div>                    <div class="row">
                <a href="#" onclick="gendiv('../scrmaestro/scrmaestro.php?scr=cm_grprov&mod=cm', 'Grupos de proveedores');">
                    <div class="col-4 col-sm-auto b4-btn-tool div-tool">
                        <div class="b4-txt-but-tool colr-comp mt-2">
                            <center>
                                <div class="btn-area mb-2" style="background-image: url('../img/light/com/grprovec_icon.png');">  </div>
                            </center>
                    Grupos de proveedores
                    </div>
                    </div>
                </a>
            </div>                    <div class="row">
                <a href="#" onclick="gendiv('../scrmaestro/scrmaestro.php?scr=iw_invmae&mod=cm', 'Productos');">
                    <div class="col-4 col-sm-auto b4-btn-tool div-tool">
                        <div class="b4-txt-but-tool colr-comp mt-2">
                            <center>
                                <div class="btn-area mb-2" style="background-image: url('../img/light/com/productosc_icon.png');">  </div>
                            </center>
                    Productos
                    </div>
                    </div>
                </a>
            </div>                    <div class="row">
                <a href="#" onclick="gendiv('../scrmaestro/scrmaestro.php?scr=iw_almacen&mod=cm', 'Almacenes');">
                    <div class="col-4 col-sm-auto b4-btn-tool div-tool">
                        <div class="b4-txt-but-tool colr-comp mt-2">
                            <center>
                                <div class="btn-area mb-2" style="background-image: url('../img/light/com/almacenesc_icon.png');">  </div>
                            </center>
                    Almacenes
                    </div>
                    </div>
                </a>
            </div>                    <div class="row">
                <a href="#" onclick="gendiv('../scrmaestro/scrmaestro.php?scr=tw_suc&mod=cm', 'Sucursales');">
                    <div class="col-4 col-sm-auto b4-btn-tool div-tool">
                        <div class="b4-txt-but-tool colr-comp mt-2">
                            <center>
                                <div class="btn-area mb-2" style="background-image: url('../img/light/com/sucursalesc_icon.png');">  </div>
                            </center>
                    Sucursales
                    </div>
                    </div>
                </a>
            </div></div>
                    <div class="row b4-container-tools justify-content-center ml-0 mr-0 mt-3">
	                    <div class="accordion col-12" id="accordionExample">
	                                <div class="card">
                <div class="card-header pt-1 pb-1" id="heading0231">
                    <button class="btn btn-block text-left collapsed p-1 btn-corrc" type="button" data-toggle="collapse"
                            data-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                        <img src="../img/dark/dropdown-icons/informe-icon.png" class="icon-report"/><span class="b4-Txt-accord">Informes y consultas</span><img
                            src="../img/common/down-icon.png" style="width: 16px; float: right; padding-top: 4px;">
                    </button>
                </div>
                <div id="collapse3" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                    <div class="card-body">
                        <div class="row mbsc-justify-content-around">
                            <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../report/repform.php?idrep=cm_libcom&mod=cm', 'Libro de compras')">
        <div class="div-tool-3 p-2">Libro de compras</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../report/repform.php?idrep=cm_rcomprd&mod=cm', 'Compras por producto')">
        <div class="div-tool-3 p-2">Compras por producto</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../report/repform.php?idrep=cm_rcomprov&mod=cm', 'Compras por proveedor')">
        <div class="div-tool-3 p-2">Compras por proveedor</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../report/repform.php?idrep=cm_rcomfecha&mod=cm', 'Compras por fecha')">
        <div class="div-tool-3 p-2">Compras por fecha</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../report/repform.php?idrep=cm_rep_retaceo&mod=cm', 'Retaceo de póliza de importación')">
        <div class="div-tool-3 p-2">Retaceo de póliza de importación</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../report/repform.php?idrep=cm_rcs&mod=cm', 'Compras por sucursal')">
        <div class="div-tool-3 p-2">Compras por sucursal</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../report/repform.php?idrep=cm_retenciones_emi&mod=cm', 'Retenciones 1% IVA')">
        <div class="div-tool-3 p-2">Retenciones 1% IVA</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../tools/selexport.php?mod=cm', 'Exportación archivos .csv')">
        <div class="div-tool-3 p-2">Exportación archivos .csv</div>
    </div>

                        </div>
                    </div>
                </div>
            </div>            <div class="card">
                <div class="card-header pt-1 pb-1" id="heading0241">
                    <button class="btn btn-block text-left collapsed p-1 btn-corrc" type="button" data-toggle="collapse"
                            data-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                        <img src="../img/dark/dropdown-icons/configura-icon.png" class="icon-report"/><span class="b4-Txt-accord">Configuración</span><img
                            src="../img/common/down-icon.png" style="width: 16px; float: right; padding-top: 4px;">
                    </button>
                </div>
                <div id="collapse4" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                    <div class="card-body">
                        <div class="row mbsc-justify-content-around">
                            <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../tools/notavail.php?mod=cm', 'Período de trabajo')">
        <div class="div-tool-3 p-2">Período de trabajo</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../scrmaestro/scrmaestro.php?scr=cm_concepgastos&mod=cm', 'Conceptos de gastos')">
        <div class="div-tool-3 p-2">Conceptos de gastos</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../scrconfig/scrconfig.php?scr=tw_empresa&mod=cm', 'Datos de la empresa')">
        <div class="div-tool-3 p-2">Datos de la empresa</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../scrmaestro/scrmaestro.php?scr=cm_numprovis&opt=NOADD&mod=cm', 'Compras con número provisional')">
        <div class="div-tool-3 p-2">Compras con número provisional</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../scrdet/scrdet.php?scr=cp_numdocs&mod=cm', 'Numeración de documentos')">
        <div class="div-tool-3 p-2">Numeración de documentos</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../scrconfig/uploadlogo.html?mod=cm', 'Logo de la empresa')">
        <div class="div-tool-3 p-2">Logo de la empresa</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../scrmaestro/scrmaestro.php?scr=cm_tranprovis&opt=NOADD&mod=cm', 'Transferencias con número provisional')">
        <div class="div-tool-3 p-2">Transferencias con número provisional</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../scrmaestro/scrmaestro.php?scr=cm_compradores&mod=cm', 'Compradores')">
        <div class="div-tool-3 p-2">Compradores</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../scrblank/scrblank.php?scr=gen_cse_pl&mod=cm', 'Generar CSE de nómina honorarios')">
        <div class="div-tool-3 p-2">Generar CSE de nómina honorarios</div>
    </div>

                        </div>
                    </div>
                </div>
            </div>            <div class="card">
                <div class="card-header pt-1 pb-1" id="heading0251">
                    <button class="btn btn-block text-left collapsed p-1 btn-corrc" type="button" data-toggle="collapse"
                            data-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                        <img src="../img/dark/dropdown-icons/fac_ele.png" class="icon-report"/><span class="b4-Txt-accord">Facturación electrónica</span><img
                            src="../img/common/down-icon.png" style="width: 16px; float: right; padding-top: 4px;">
                    </button>
                </div>
                <div id="collapse5" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                    <div class="card-body">
                        <div class="row mbsc-justify-content-around">
                            <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../cm/fac_ele_revision.php?mod=cm', 'Revisión / envío de DTEs')">
        <div class="div-tool-3 p-2">Revisión / envío de DTEs</div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 b4-txt-but-tool" onclick="gendiv('../fw/consulta_reenvio_dte.php?tabla=cp02&mod=cm', 'Consulta / Re-envío de DTEs')">
        <div class="div-tool-3 p-2">Consulta / Re-envío de DTEs</div>
    </div>

                        </div>
                    </div>
                </div>
            </div>
	                    </div>
	                </div>
        
    </div></div>`;

const toggleTheme = (_isLight) => {
        if (_isLight) {
            $('#dark_style').removeAttr('disabled');
            $('#light_style').attr('disabled', true);
            $('.theme-toggle.dark').show();
            $('.theme-toggle.light').hide();
            $('.slider').addClass('slider-dark-bg');
            $('.slider').removeClass('slider-light-bg');
            localStorage.setItem('azteqTheme', 'dark');
            $('.div-tool.b4-btn-tool .b4-txt-but-tool > center > div').each((index, el)=>{
                const imgRoute = $( el ).css('background-image').split('/');
                imgRoute[5] = imgRoute[5].replace('light', 'dark');
                $( el ).css('background-image', imgRoute.join('/'));
            });
            $('.footer>img').attr('src', '../img/common/AzteQ-LogotipoBlanco.png');
            $('.icon-report').each((index, el)=>{
                const imgRoute = $( el ).attr('src').split('/');
                if (!imgRoute[2]) {
                    return;
                }
                imgRoute[2] = imgRoute[2].replace('light', 'dark');
                $( el ).attr('src', imgRoute.join('/'));
            });
        } else {
            $('#light_style').removeAttr('disabled');
            $('#dark_style').attr('disabled', true);
            $('.theme-toggle.light').show();
            $('.theme-toggle.dark').hide();
            $('.slider').removeClass('slider-dark-bg');
            $('.slider').addClass('slider-light-bg');
            localStorage.setItem('azteqTheme', 'light');
            $('.div-tool.b4-btn-tool .b4-txt-but-tool > center > div').each((index, el)=>{
                const imgRoute = $( el ).css('background-image').split('/');
                imgRoute[5] = imgRoute[5].replace('dark', 'light');
                $( el ).css('background-image', imgRoute.join('/'));
            });
            $('.footer>img').attr('src', '../img/common/AzteQ-LogotipoNegro.png');
            $('.icon-report').each((index, el)=>{
                const imgRoute = $( el ).attr('src').split('/');
                if (!imgRoute[2]) {
                    return;
                }
                imgRoute[2] = imgRoute[2].replace('dark', 'light');
                $( el ).attr('src', imgRoute.join('/'));
            });
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

function gendiv(laurl, eltitulo, html_content) {
    /* alert(laurl); */
    /*
    var ancho = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var altura = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    altura = 5600;
    thehtml = '<iframe src="' + laurl +'" width="' + ancho +'" height="' + altura +'"></iframe>';
    $("#maindiv").html(thehtml);
    */
    maxId = maxId + 1;
    thisMenuId = 'menuid' + maxId;
    if (laurl=='#') {
        $('#mainFrameTabs').bTabsAdd(thisMenuId, eltitulo, laurl, html_content);
        loadTheme();
    }
    else {
        $('#mainFrameTabs').bTabsAdd(thisMenuId, eltitulo, laurl);
    }


}

$(function() {

    $('#theme-switch').on("change", () => {
        toggleTheme(isLight);
    })
    $('#mainFrameTabs').bTabs({

        /**
         * url to direct
         */
        'loginUrl' : '/',

        /**
         * custom class
         */
        'className' : undefined,

        /**
         * enable drag and drop
         * requires jQuery UI
         */
        'sortable' : true,

        /**
         * callback on resize
         */
        'resize' : undefined

    });

    //var calcHeight = function(){
    //    $('#mainFrameTabs').height(140);
    //};
    // init
    //$('#mainFrameTabs').bTabs({
    //    resize : calcHeight
    //});

    var laurl = '#';
    gendiv(laurl, 'Compras', html_menu);
});
</script>
</html>