<?php
/**
 * Template Name: Countries list
 *
 * @package WordPress
 * @subpackage Twenty_Fourteen
 * @since Twenty Fourteen 1.0
 */
get_header(); ?>

	<div id="primary" class="content-area">
		<div id="content" class="site-content" role="main">
			<div class="col-sm-2" style="height: 100%;">
        <div class="row" style="border-bottom: solid 1px #CFCFCF;border-right: solid 1px #000000;background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);">
            <div class="col-sm-12 text-center margin-bottom height-40 padding-top-8" style="font-size: 20px;
font-weight: bold;" >
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
        <div class="row" style="border-bottom: solid 1px #CFCFCF;border-right: solid 1px #000000;background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);">
            <div class="col-sm-12 margin-bottom height-40 padding-top-8" id="flowchart-title" style="font-size: 20px;
font-weight: bold;">
                FLOWCHART
            </div>
        </div>
        <div class="col-sm-12" style="padding-top:15px;">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <h3 class="panel-title">General informations</h3>
                </div>
                <div class="panel-body">
                    <div class="col-sm-2">
                        Langues :
                    </div>
                    <div class="col-sm-8" id='listLanguages'>
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
        <div class="col-sm-12">
            <div class="col-sm-9">
                <div class="col-sm-2">
                    <a href="#" class="btn btn-primary" id="mergeInProduction">Merge in production</a>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="btn-group pull-right">
                    <a href="#" class="btn btn-primary" id="edit-diagram">Edit</a>
                    <a href="#" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="#" id="readonly-modal">Read only</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="col-sm-3" style="height: 100%;">
        <div class="row" style="border-bottom: solid 1px #CFCFCF;border-right: solid 1px #000000;background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);">
            <div class="col-sm-12 text-center margin-bottom height-40 padding-top-8" style="font-size: 20px;
font-weight: bold;">
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
    <script src="/outofcopyright/js/bootstrap.min.js"></script>
    <script src="/outofcopyright/js/countries-list.js"></script>
		</div><!-- #content -->
	</div><!-- #primary -->

<?php
get_sidebar( 'content' );
get_sidebar();
get_footer();
