<?php
/**
 * Template Name: Diagramm editor
 *
 * @package WordPress
 * @subpackage Twenty_Fourteen
 * @since Twenty Fourteen 1.0
 */
get_header(); ?>

	<div id="primary" class="content-area">
		<div id="content" class="site-content" role="main">
            <div class="col-sm-2" style="max-height: 100%;">
        <div class="row" style="border-bottom: solid 1px #CFCFCF;border-right: solid 1px #000000;background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);">
            <div class="col-sm-12 margin-bottom height-40 padding-top-8" style="font-size: 20px;font-weight: bold;">
                <a href="countries-list.html" id="countryTitle"></a>
            </div>
        </div>
        <div class="row" id="leftPart" style="border-right: solid 3px #CFCFCF;">
            <div class="row" id="typeOfWorkRow" style="margin-top: 10px; margin-left: 5px; margin-right: 5px;">
                <div class="panel panel-primary">
                    <div class="panel-heading" style=" height: 42px; ">
                        <div class="col-sm-9">
                            <h6 class="panel-title" style=" padding-top: 2px; ">Type of work</h6>
                        </div>
                        <div class="col-sm-3">
                            <a href="#" id="addTypeOfWorkButton" style=" margin-top: 10px;">
                                <i class="fa fa-plus-square-o bg-primary fa-lg"></i>
                            </a>
                        </div>
                    </div>
                    <div class="panel-body" style="overflow-y: auto; overflow-x: hidden;" id="listTypeOfWorkRow">
                        <ul id="listTypeOfWork" class="nav nav-pills nav-stacked">
                        </ul>
                    </div>
                </div>
            </div>
            <div class="row" id="datapointsRow" style="margin-left: 5px; margin-right: 5px; ">
                <div class="panel panel-primary">
                    <div class="panel-heading" style=" height: 42px; ">
                        <div class="col-sm-9">
                            <h6 class="panel-title" style=" padding-top: 2px; ">Datapoints</h6>
                        </div>
                        <div class="col-sm-3">
                            <a href="#" id="addDatapointModalButton" style=" margin-top: 10px;">
                                <i class="fa fa-plus-square-o bg-primary fa-lg"></i>
                            </a>
                        </div>
                    </div>
                    <div class="panel-body" style="overflow-y: auto; overflow-x: hidden;" id="listDatapointsRow">
                        <ul id="listDatapoints" class="nav nav-pills nav-stacked">
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <div class="col-sm-7" id='drawZone' style="height:100%;padding-left:0px;padding-right: 0px;">
            <!--<div class="row text-center text-primary" style="height: 23px; margin-top:2px;margin-right: -30px;margin-left:0px;">
                <div class="col-sm-10" style=" padding-left: 0px; padding-right: 0px; height: 23px;">
                    <ul class="breadcrumb" style=" padding-top: 0px; padding-bottom: 0px; ">
                      <li><a href="countries-list.html" id="countrySelected"></a></li>
                      <li class="active" id="typeOfWorkSelected"></li>
                    </ul>
                </div>
                <div class="col-sm-2" style=" padding-left: 0px; padding-right: 0px; ">
                    <div class="col-sm-3 buttonClickable" style=" padding-left: 0px; padding-right: 0px; " onclick="zoomIn();">+</div>
                    <div class="col-sm-4 buttonClickable" style=" padding-left: 0px; padding-right: 0px; " onclick="zoomReinit();">Reinit.</div>
                    <div class="col-sm-3 buttonClickable" style=" padding-left: 0px; padding-right: 0px; " onclick="zoomOut();">-</div>
                </div>
                
            </div>-->
            <div class="row" style="border-bottom: solid 1px #CFCFCF;border-right: solid 1px #000000;background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);margin-left: 0px;">
                <div class="col-sm-12 margin-bottom height-40 padding-top-8" id="subchart-title" style="font-size: 20px;
font-weight: bold;">
                
                </div>
            </div>
            <div class="alert alert-dismissable alert-success" id="alertSuccess" style="display: none;">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <p id="messageAlert"></p>
            </div>
            <div class="row" style=" margin-left: 0px; ">
                <svg id='drawSvg' ></svg>
            </div>
            
        </div>


    <div class="col-sm-3" id='selectANode'>
        <div class="row" style="border-bottom: solid 1px #CFCFCF;border-left: solid 1px #000000;background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);">
            <div class="col-sm-12 text-center margin-bottom height-40 padding-top-8" style="font-size: 20px;
font-weight: bold;">
                Properties
            </div>
        </div>
        <div class="row" style="border-left: solid 3px #CFCFCF;">
            <div class="vertical-center">
                <span class="text-center" style="margin-left: 35%;">Select a node</span>
            </div>
        </div>
        
    </div>
    <div class="col-sm-3" id='panelProperties' style="display:none;">
        <div class="row" style="border-bottom: solid 1px #CFCFCF;border-left: solid 1px #000000;background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);">
            <div class="col-sm-12 text-center margin-bottom height-40 padding-top-8" style="font-size: 20px;
font-weight: bold;">
                Properties
            </div>
        </div>

        <div class="row">
            <div class="col-sm-3 buttonProperties text-center" onclick="clickPropertiesButton('formulaButton')" id="formulaButton">
                <i class="fa fa-superscript fa-3x"></i>
                <span>Formula</span>
            </div>
            <div class="col-sm-3 buttonProperties text-center" onclick="clickPropertiesButton('listButton')" id="listButton">
                <i class="fa fa-list-ul fa-3x"></i>
                <span>List</span>
            </div> 
            <div class="col-sm-3 buttonProperties text-center" onclick="clickPropertiesButton('aliasButton')"  id="aliasButton">
                <i class="fa fa-link fa-3x"></i>
                <span>Alias</span>
            </div>
            <div class="col-sm-3 buttonProperties text-center" onclick="clickPropertiesButton('resultButton')" id="resultButton">
                <i class="fa fa-gavel fa-3x"></i>
                <span>Result</span>
            </div>
        </div>
        <div class="row buttonPropertyActive questionPart">
            <span class="margin-left">Question :</span>
        </div>
        
        <div class="row buttonPropertyActive questionPart">
            <textarea id="question" class="col-sm-12 buttonPropertyActive form-control" style="padding-left: 10px;"></textarea>
        </div>
        <div class="panelProperty" id="formulaPanel" style="display:none;">
            <div class="row buttonPropertyActive" style="padding-top: 10px;">
                <span class="margin-left">Datapoints :</span>
            </div>
            <div class="row buttonPropertyActive">
                <select class="form-control buttonPropertyActive" id="datapointsFormula" style="border:none;background-color:#22abd4;">
                    <option>Select datapoint</option>
                </select>
            </div>
            <div class="row buttonPropertyActive">
                <div class="col-sm-6 text-center height-50">
                    <span class="btn btn-primary-formula col-sm-12" id="plusFormula">Plus</span>
                </div>
                <div class="col-sm-6 text-center height-50">
                    <span class="btn btn-primary-formula col-sm-12" id="minusFormula">Minus</span>
                </div>
                
            </div>
            <div class="row buttonPropertyActive" style=" height: 70px; ">
                <div class="col-sm-6 text-center height-50">
                    <span class="btn btn-primary-formula col-sm-12" id="superiorFormula">is larger<br/>than</span>
                </div>
                <div class="col-sm-6 text-center height-50">
                    <span class="btn btn-primary-formula col-sm-12" id="inferiorFormula">is smaller<br/>than</span>
                </div>
            </div>
            <div class="row buttonPropertyActive" id="formula" style="height:100px;overflow:auto;">
            </div>
            <div class="row buttonPropertyActive" id="formulaResetDiv">
                <span class="btn btn-primary-formula col-sm-12" id="formulaReset">Reset Formula</span>
            </div>
            <div class="row buttonPropertyActive text-center formulaResult" id="formula-success" style="background-color:rgb(2, 111, 2);display:none;" >
                <i class="fa fa-check text-success fa-2x"></i>
            </div>
            <div class="row buttonPropertyActive text-center formulaResult" id="formula-warning" style="background-color:rgb(255, 222, 161);display:none;" >
                <i class="fa fa-exclamation-triangle text-warning fa-2x"></i>
            </div>
        </div>
        <div class="panelProperty" id="listPanel" style="display:none;">
            <div class="row buttonPropertyActive" style="padding-top: 10px;">
                <span class="margin-left">Datapoints :</span>
            </div>
            <div class="row buttonPropertyActive">
                <select class="form-control buttonPropertyActive" id="datapointsList" style="border:none;background-color:#22abd4;">
                    <option>Select datapoint</option>
                </select>
            </div>
            <div class="row buttonPropertyActive">
                <span class="margin-left">Responses list :</span>
            </div>
            <div id="responsesList"></div>
        </div>
        <div class="panelProperty" id="aliasPanel" style="display:none;">
            <div class="row buttonPropertyActive responseToChangePart">
                <span class="margin-left">Response to change :</span>
            </div>
            <div class="row buttonPropertyActive responseToChangePart">
                <select class="form-control buttonPropertyActive" id="aliasResponse" style="border:none;background-color:#22abd4;">
                    <option>Select a response</option>
                </select>
            </div>
            <div class="row buttonPropertyActive" style="padding-top: 10px;">
                <span class="margin-left">New node :</span>
            </div>
            <div class="row buttonPropertyActive">
                <select class="form-control buttonPropertyActive" id="aliasNode" style="border:none;background-color:#22abd4;">
                    <option>Select a node</option>
                </select>
            </div>
        </div>
        <div class="panelProperty" id="resultPanel" style="display:none;">
            <div class="row buttonPropertyActive" style="padding-top: 10px;">
                <span class="margin-left">Text :</span>
            </div>
            <div class="row buttonPropertyActive">
                <textarea id="resultText" class="col-sm-12 buttonPropertyActive form-control" style="padding-left: 10px;"></textarea>
            </div>
        </div>
        <div class="row buttonPropertyActive" id="blueMargin" >
            <div class="alert alert-dismissable alert-warning" id="warningDelete" style="display: none;">
                <button type="button" class="close">×</button>
                <h4>Warning!</h4>
                <p>Can not delete a child node.</p>
            </div>
        </div>
        <div class="row buttonPropertyActive text-center" style="font-size:28px;">
            <span class="btn btn-danger col-sm-12 margin-top" id="deleteNode">Delete node</span>
        </div>
        <div class="row buttonPropertyActive text-center" style="font-size:28px;">
            <span class="btn btn-success col-sm-12" id="saveok">OK</span>
        </div>
    </div>
    <div id="buttonSave" class="col-sm-3">
        <div class="row buttonPropertyActive text-center" style="font-size:28px;">
            <span class="btn btn-primary col-sm-12" id="save">Save</span>
        </div>
    </div>

    <!-- MODAL DIALOG -->

    <div class="modal" id="addTypeOfWorkModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Add type of work</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <fieldset>
                            <div class="form-group">
                                <label for="nameTypeOfWork" class="col-lg-2 control-label" >Name</label>
                                <div class="col-lg-10">
                                    <input type="text" id="nameTypeOfWork" class="form-control inputLine" placeholder="Name">
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default closeButton"  data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="addNewTypeOfWork">Add new type of work</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="addModifyDatapointModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title" id="datapoint-modal-title">Add Datapoint</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <fieldset>
                            <div class="form-group">
                                <label for="idDatapoint" class="col-lg-3 control-label" >ID</label>
                                <div class="col-lg-9">
                                    <input type="text" id="idDatapoint" class="form-control inputLine" placeholder="ID">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="hintDatapoint" class="col-lg-3 control-label" >Additionnal information</label>
                                <div class="col-lg-9">
                                    <input type="text" id="hintDatapoint" class="form-control inputLine" placeholder="Additionnal information">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="hintDatapoint" class="col-lg-3 control-label" >Question</label>
                                <div class="col-lg-9">
                                    <input type="text" id="questionDatapoint" class="form-control inputLine" placeholder="Question">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="typeDatapoint" class="col-lg-3 control-label" >Type</label>
                                <div class="col-lg-9">
                                    <select id="typeDatapoint" class="form-control">
                                        <option value="">Select a type</option>
                                        <option value="list">List</option>
                                        <option value="numeric">Numeric</option>
                                        <option value="static">Static</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group valueDatapoint" id="valueDatapoint-group" style="display:none;">
                                <label for="valueDatapoint" class="col-lg-3 control-label" >Value</label>
                                <div class="col-lg-9">
                                    <input type="text" id="valueDatapoint" class="form-control inputLine" placeholder="Value">
                                </div>
                            </div>
                            <div id="list-elements" class="listValueDatapoint" style="height:200px;overflow-y: auto;overflow-x: hidden;display:none;">
                                <div class="form-group listValueDatapoint" id="listValueDatapoint1-group" style="display:none;">
                                    <label for="listValueDatapoint1" class="col-lg-3 control-label" >Element 1</label>
                                    <div class="col-lg-9">
                                        <input type="text" id="listValueDatapoint1" class="form-control inputLine" placeholder="Element 1">
                                    </div>
                                </div>
                                <div class="form-group listValueDatapoint" id="listValueDatapoint2-group" style="display:none;">
                                    <label for="listValueDatapoint2" class="col-lg-3 control-label" >Element 2</label>
                                    <div class="col-lg-9">
                                        <input type="text" id="listValueDatapoint2" class="form-control inputLine" placeholder="Element 2">
                                    </div>
                                </div>
                                <div class="form-group listValueDatapoint" id="listValueDatapoint3-group" style="display:none;">
                                    <label for="listValueDatapoint3" class="col-lg-3 control-label" >Element 3</label>
                                    <div class="col-lg-9">
                                        <input type="text" id="listValueDatapoint3" class="form-control inputLine" placeholder="Element 3">
                                    </div>
                                </div>
                                <div class="form-group listValueDatapoint" id="listValueDatapoint4-group" style="display:none;">
                                    <label for="listValueDatapoint4" class="col-lg-3 control-label" >Element 4</label>
                                    <div class="col-lg-9">
                                        <input type="text" id="listValueDatapoint4" class="form-control inputLine" placeholder="Element 4">
                                    </div>
                                </div>
                                <div class="form-group listValueDatapoint" id="listValueDatapoint5-group" style="display:none;">
                                    <label for="listValueDatapoint5" class="col-lg-3 control-label" >Element 5</label>
                                    <div class="col-lg-9">
                                        <input type="text" id="listValueDatapoint5" class="form-control inputLine" placeholder="Element 5">
                                    </div>
                                </div>
                            </div>
                            <div class="row listValueDatapoint" id="addListElements" style="display:none;cursor:pointer;">
                                <div class="col-sm-10">
                                </div>
                                <div class="col-sm-2">
                                    <i class="fa fa-plus text-success fa-lg"></i>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default closeButton"  data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="addModifyDatapoint">Add new datapoint</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="deleteNodeModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Delete node</h4>
                </div>
                <div class="modal-body">
                    <p>Are you sure do you want to delete this node ?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default closeButton" data-dismiss="modal">No</button>
                    <button type="button" class="btn btn-primary" id="confirmDeleteNode">Yes</button>
              </div>
            </div>
        </div>
    </div>

    <div class="modal" id="saveModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Save</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="commitMessage" class="col-lg-2 control-label" >Note</label>
                        <div class="col-lg-10">
                            <textarea class="col-sm-12" id="commitMessage" placeholder="Note"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default closeButton" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="sendCommit">Save</button>
              </div>
            </div>
        </div>
    </div>

    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="/www/outofcopyright-website/outofcopyright/js/bootstrap.min.js"></script>
    <script src="/www/outofcopyright-website/outofcopyright/js/diagram-editor.js"></script>

    <script>
    var current_user = new Object();
    <?php 
        $current_user = wp_get_current_user();
        echo "current_user.login = '".$current_user->user_login."';\n\r";
        echo "current_user.firstname = '".$current_user->user_firstname."';\n\r";
        echo "current_user.lastname = '".$current_user->user_lastname."';\n\r";
        echo "current_user.id = ".$current_user->ID.";\n\r";
     ?>
     console.log(current_user);
    </script>
</div><!-- #content -->
</div><!-- #primary -->

<?php
get_sidebar( 'content' );
get_sidebar();
get_footer();