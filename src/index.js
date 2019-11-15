import _ from "lodash";
import $ from "jquery";

const dom = $('<div>');
dom.html(_.join(['ye', 'dong'], '----'));
$('body').append(dom);