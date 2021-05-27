/**
 * Created by gaoerjun on 2017/4/17.
 */
import get from "./get";
var isAndroid = get.data.appOrigin && get.data.appOrigin.toUpperCase() == "ANDROID";
var isIos =get.data.appOrigin && get.data.appOrigin.toUpperCase() == "IOS";
export default {
  isIos:isIos,
  isAndroid :isAndroid,
  isAPP:isAndroid || isIos
}