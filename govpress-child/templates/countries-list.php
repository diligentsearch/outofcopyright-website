<?php
/**
 * Template Name: Countries list
 *
 * @package WordPress
 * @subpackage Twenty_Fourteen
 * @since Twenty Fourteen 1.0
 */

$current_user = wp_get_current_user();
if($current_user->ID == 0){
    header('Location: /wp-admin/'); 
}
$admin = $current_user->roles[0] == 'administrator';
$contributor = $current_user->roles[0] == 'contributor';
if(!$admin && !$contributor){
    header('Location: /wp-admin/'); 
}

get_header(); 



?>

	<div id="primary" class="content-area">
		<div id="content" class="site-content" role="main">
			<div class="col-sm-2" style="height: 100%;">
        <div class="row" style="border-bottom: solid 1px #CFCFCF;border-right: solid 3px #CFCFCF;background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);">
            <div class="col-sm-12 text-center margin-bottom height-40 padding-top-15 grey-color" style="font-weight: bold;" >
                COUNTRIES
            </div>
        </div>
        <div class="row" style="border-right: solid 3px #CFCFCF;padding-top: 15px;height: 100%;">
            <div class="col-sm-12" >
                <ul id="listCountries" class="nav nav-pills nav-stacked" style="margin-left: 0px;" >
                </ul>
            </div>
        </div>
    </div>
    <div class="col-sm-7">
        <div class="row" style="border-bottom: solid 1px #CFCFCF;background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);">
            <div class="col-sm-12 margin-bottom height-40 padding-top-15 grey-color" id="flowchart-title" style="font-weight: bold;">
                FLOWCHART
            </div>
        </div>
        <div class="alert alert-dismissable alert-success" id="alertSuccess" style="display: none;">
            <button type="button" class="close">×</button>
            <p id="messageAlert"></p>
        </div>
        <div class="alert alert-dismissable alert-warning" id="alertWarning" style="display: none;">
            <button type="button" class="close">×</button>
            <p id="messageAlertWarning"></p>
        </div>
        <div class="col-sm-12" style="padding-top:15px;">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <h3 class="panel-title">General informations</h3>
                </div>
                <div class="panel-body">
                    <div class="col-sm-4">
                        Languages :
                    </div>
                    <div class="col-sm-6" id='listLanguages'>
                    </div>
                    <div class="col-sm-1">
                        <a href="#" id="uploadPOFileButton">
                            <i title="Upload PO file" class="fa fa-upload fa-2x"></i>
                        </a>
                    </div>
                    <div class="col-sm-1 padding-top-1">
                        <a href="#" id="downloadPOFileButton">
                            <i title="Download PO file" class="fa fa-download fa-2x"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <h3 class="panel-title">Contributors</h3>
                </div>
                <div class="panel-body">
                    <table class="table table-striped table-hover ">
                        <tbody id="contributors">
                        </tbody>
                    </table> 
                    <!--<div class="row">
                        <div class="col-sm-10">
                        </div>
                        <div class="col-sm-2">
                            <a href="#" class="btn btn-primary" id="addContributorButton">+</a>
                        </div>
                    </div>-->
                </div>
            </div>
        </div>
        <div class="col-sm-12" style=" height: 70px;  float: right;">
                <div class="btn-group pull-right" style=" float: right; margin-left: 10px; ">
                    <a href="#" class="btn btn-primary" id="edit-diagram" style="color:#fff">
                        <i class="fa fa-pencil fa-lg" style="margin-right: 10px;"></i>
                        Edit
                    </a>
                    <a href="#" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="#" id="readonly-modal">Read only</a></li>
                    </ul>
                </div>
                <div class="btn-group pull-right" style=" float: right; margin-left: 10px; ">
                    <a href="#" class="btn btn-primary" id="testForm" style="color:#fff" onclick="testCountry();">
                        <i class="fa fa-flask fa-lg" style="margin-right: 10px;"></i>
                        Test
                    </a>
                    <a href="#" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
                    <ul class="dropdown-menu" style=" width: 300px; ">
                        <li><a href="#" id="readonly-modal" onclick="testCountry();">UI Test Form</a></li>
                        <li>
                            <div class="row" style="padding-top: 10px;">
                                <div class="col-sm-3" style="padding-right: 0px;padding-top: 10px;padding-left: 30px;">
                                    API Test
                                </div>
                                <div class="col-sm-8" style="padding-left: 0px;">
                                    <input type="text" id="apiURL">
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            
            <?php if($admin){ ?>
                <a href="#" class="btn btn-primary" id="mergeInProduction" style="color:#fff;float: right; margin-left: 10px; ">
                    <i class="fa fa-code-fork fa-lg" style="margin-right: 10px;"></i>
                    Merge in production
                </a>
            <?php } ?>
        </div>
    </div>
    <div class="col-sm-3" style="height: 100%;">
        <div class="row" style="border-bottom: solid 1px #CFCFCF;border-right: solid 1px #000000;background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);">
            <div class="col-sm-1 height-40" style="border-left: solid 3px #CFCFCF;height: 56px;padding-left: 0px;padding-right: 0px;margin-left: 6px;width: 3px;"></div>
            <div class="col-sm-11 text-center margin-bottom height-40 padding-top-15 grey-color" style="font-weight: bold;padding-left: 0px;padding-right: 0px;">
                CHANGELOG
            </div>
        </div>
        <div class="row" id="changeLog">
        </div>
    </div>

    <!-- MODAL DIALOG -->

    <div class="modal" id="downloadPOFileModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Download PO File</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <fieldset>
                            <div class="form-group">
                                <label for="languageToDownload" class="col-lg-2 control-label" >Language</label>
                                <div class="col-lg-10">
                                    <select id="languageToDownload" class="form-control">
                                    </select>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default closeButton"  data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="downloadLanguage">Download</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="uploadPOFileModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Upload PO File</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <fieldset>
                            <div class="form-group">
                                <label for="languageToUpload" class="col-lg-2 control-label" >Initial language</label>
                                <div class="col-lg-10">
                                    <input type="text" id="languageToUpload" maxlength="2" class="form-control inputLine" placeholder="Initial language" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="languageToUpload" class="col-lg-2 control-label" >File</label>
                                <div class="col-lg-10">
                                    <input type="file" id="fileToUpload" class="form-control inputLine"/>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                    <div class="alert alert-dismissable alert-warning" id="alertTranslate" style="display:none;">
                      <button type="button" class="close" data-dismiss="alert">×</button>
                        <h4>Warning!</h4>
                        <p id="missingTranslationMessage"></p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default closeButton"  data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="uploadLanguage">Upload</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="addContributorModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Add contributor</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <fieldset>
                            <div class="form-group">
                                <label for="contributorName" class="col-lg-2 control-label" >Name</label>
                                <div class="col-lg-10">
                                    <input type="text" id="contributorName" class="form-control inputLine" placeholder="Name" />
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default closeButton"  data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="addContributor">Add</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="readOnlyModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Read only by language</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <fieldset>
                            <div class="form-group">
                                <label for="contributorName" class="col-lg-2 control-label" >Language</label>
                                <div class="col-lg-10">
                                    <select id="chooseLanguageReadOnly" name="chooseLanguageReadOnly" class="form-control" ></select>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default closeButton"  data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="readOnlyLanguage">Read only</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="/wp-content/themes/govpress-child/js/bootstrap.min.js"></script>
    <script src="/wp-content/themes/govpress-child/js/countries-list.js"></script>
    <script>
        $(".site-content").css("padding","0px");
        $(".site-branding").hide();
        $(".site-header").css("padding-bottom", "0px");
        $('.dropdown-menu input, .dropdown-menu label').click(function(e) {
            e.stopPropagation();
        });
    </script>
		</div><!-- #content -->
	</div><!-- #primary -->

<?php
get_sidebar( 'content' );
get_sidebar();
get_footer();
