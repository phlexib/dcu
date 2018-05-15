/*jslint vars: true , plusplus: true, continue:true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global bm_keyframeHelper, bm_eventDispatcher, bm_generalUtils, PropertyFactory, Matrix*/
var bm_shapeHelper = (function () {
    'use strict';
    var ob = {}, shapeItemTypes = {
        shape: 'sh',
        rect: 'rc',
        ellipse: 'el',
        star: 'sr',
        fill: 'fl',
        gfill: 'gf',
        gStroke: 'gs',
        stroke: 'st',
        merge: 'mm',
        trim: 'tm',
        twist: 'tw',
        group: 'gr',
        repeater: 'rp',
        roundedCorners: 'rd'
    };
    var navigationShapeTree = [];
    var extraParams = {};

    function getItemType(matchName) {
        switch (matchName) {
        case 'ADBE Vector Shape - Group':
            return shapeItemTypes.shape;
        case 'ADBE Vector Shape - Star':
            return shapeItemTypes.star;
        case 'ADBE Vector Shape - Rect':
            return shapeItemTypes.rect;
        case 'ADBE Vector Shape - Ellipse':
            return shapeItemTypes.ellipse;
        case 'ADBE Vector Graphic - Fill':
            return shapeItemTypes.fill;
        case 'ADBE Vector Graphic - Stroke':
            return shapeItemTypes.stroke;
        case 'ADBE Vector Graphic - Merge':
        case 'ADBE Vector Filter - Merge':
            return shapeItemTypes.merge;
        case 'ADBE Vector Graphic - Trim':
        case 'ADBE Vector Filter - Trim':
            return shapeItemTypes.trim;
        case 'ADBE Vector Graphic - Twist':
        case 'ADBE Vector Filter - Twist':
            return shapeItemTypes.twist;
        case 'ADBE Vector Filter - RC':
            return shapeItemTypes.roundedCorners;
        case 'ADBE Vector Group':
            return shapeItemTypes.group;
        case 'ADBE Vector Graphic - G-Fill':
            return shapeItemTypes.gfill;
        case 'ADBE Vector Graphic - G-Stroke':
            return shapeItemTypes.gStroke;
        case 'ADBE Vector Filter - Repeater':
            return shapeItemTypes.repeater;
        default:
            //bm_eventDispatcher.log(matchName);
            return '';
        }
    }

    function checkAdditionalCases(prop) {
        if(extraParams && extraParams.is_rubberhose_autoflop && prop.name === 'Admin'){
            return true;
        }
        return false;
    }
    
    function iterateProperties(iteratable, array, frameRate, stretch, isText) {
        var i, len = iteratable.numProperties, ob, prop, itemType;
        for (i = 0; i < len; i += 1) {
            ob = null;
            prop = iteratable.property(i + 1);
            if (prop.enabled || checkAdditionalCases(prop)) {
                itemType = getItemType(prop.matchName);
                if (isText && itemType !== shapeItemTypes.shape && itemType !== shapeItemTypes.group && itemType !== shapeItemTypes.merge) {
                    continue;
                }
                if (itemType === shapeItemTypes.shape) {
                    ob = {};
                    ob.ind = i;
                    ob.ty = itemType;
                    ob.ix = prop.propertyIndex;
                    ob.ks = bm_keyframeHelper.exportKeyframes(prop.property('Path'), frameRate, stretch);
                    checkVertexCount(ob.ks.k);
                    if (prop.property("Shape Direction").value === 3) {
                        reverseShape(ob.ks.k);
                    }
                    //bm_generalUtils.convertPathsToAbsoluteValues(ob.ks.k);
                } else if (itemType === shapeItemTypes.rect && !isText) {
                    ob = {};
                    ob.ty = itemType;
                    ob.d = prop.property("Shape Direction").value;
                    ob.s = bm_keyframeHelper.exportKeyframes(prop.property('Size'), frameRate, stretch);
                    ob.p = bm_keyframeHelper.exportKeyframes(prop.property('Position'), frameRate, stretch);
                    ob.r = bm_keyframeHelper.exportKeyframes(prop.property('Roundness'), frameRate, stretch);
                } else if(itemType === shapeItemTypes.star && !isText) {
                    ob = {};
                    ob.ty = itemType;
                    ob.sy = prop.property("Type").value;
                    ob.d = prop.property("Shape Direction").value;
                    ob.pt = bm_keyframeHelper.exportKeyframes(prop.property('Points'), frameRate, stretch);
                    ob.pt.ix = prop.property('Points').propertyIndex;
                    ob.p = bm_keyframeHelper.exportKeyframes(prop.property('Position'), frameRate, stretch);
                    ob.p.ix = prop.property('Position').propertyIndex;
                    ob.r = bm_keyframeHelper.exportKeyframes(prop.property('Rotation'), frameRate, stretch);
                    ob.r.ix = prop.property('Rotation').propertyIndex;
                    if(ob.sy === 1) {
                        ob.ir = bm_keyframeHelper.exportKeyframes(prop.property('Inner Radius'), frameRate, stretch);
                        ob.ir.ix = prop.property('Inner Radius').propertyIndex;
                        ob.is = bm_keyframeHelper.exportKeyframes(prop.property('Inner Roundness'), frameRate, stretch);
                        ob.is.ix = prop.property('Inner Roundness').propertyIndex;
                    }
                    ob.or = bm_keyframeHelper.exportKeyframes(prop.property('Outer Radius'), frameRate, stretch);
                    ob.or.ix = prop.property('Outer Radius').propertyIndex;
                    ob.os = bm_keyframeHelper.exportKeyframes(prop.property('Outer Roundness'), frameRate, stretch);
                    ob.os.ix = prop.property('Outer Roundness').propertyIndex;
                    ob.ix = prop.propertyIndex;
                } else if (itemType === shapeItemTypes.ellipse) {
                    ob = {};
                    ob.d = prop.property("Shape Direction").value;
                    ob.ty = itemType;
                    ob.s = bm_keyframeHelper.exportKeyframes(prop.property('Size'), frameRate, stretch);
                    ob.p = bm_keyframeHelper.exportKeyframes(prop.property('Position'), frameRate, stretch);
                } else if (itemType === shapeItemTypes.fill) {
                    ob = {};
                    ob.ty = itemType;
                    ob.c = bm_keyframeHelper.exportKeyframes(prop.property('Color'), frameRate, stretch);
                    ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Opacity'), frameRate, stretch);
                    ob.r = prop.property('Fill Rule').value;
                } else if (itemType === shapeItemTypes.gfill) {
                    ob = {};
                    ob.ty = itemType;
                    ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Opacity'), frameRate, stretch);
                    ob.r = prop.property('Fill Rule').value;
                    navigationShapeTree.push(prop.name);
                    exportGradientData(ob,prop,frameRate, stretch, navigationShapeTree);
                    navigationShapeTree.pop();

                } else if (itemType === shapeItemTypes.gStroke) {
                    ob = {};
                    ob.ty = itemType;
                    ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Opacity'), frameRate, stretch);
                    ob.w = bm_keyframeHelper.exportKeyframes(prop.property('Stroke Width'), frameRate, stretch);
                    navigationShapeTree.push(prop.name);
                    exportGradientData(ob,prop,frameRate, stretch, navigationShapeTree);
                    navigationShapeTree.pop();
                    ob.lc = prop.property('Line Cap').value;
                    ob.lj = prop.property('Line Join').value;
                    if (ob.lj === 1) {
                        ob.ml = prop.property('Miter Limit').value;
                    }
                    getDashData(ob,prop, frameRate, stretch);

                } else if (itemType === shapeItemTypes.stroke) {
                    ob = {};
                    ob.ty = itemType;
                    ob.c = bm_keyframeHelper.exportKeyframes(prop.property('Color'), frameRate, stretch);
                    ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Opacity'), frameRate, stretch);
                    ob.w = bm_keyframeHelper.exportKeyframes(prop.property('Stroke Width'), frameRate, stretch);
                    ob.lc = prop.property('Line Cap').value;
                    ob.lj = prop.property('Line Join').value;
                    if (ob.lj === 1) {
                        ob.ml = prop.property('Miter Limit').value;
                    }
                    getDashData(ob,prop, frameRate, stretch);

                } else if (itemType === shapeItemTypes.repeater) {
                    ob = {};
                    ob.ty = itemType;
                    ob.c = bm_keyframeHelper.exportKeyframes(prop.property('Copies'), frameRate, stretch);
                    ob.c.ix = prop.property('Copies').propertyIndex;
                    ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Offset'), frameRate, stretch);
                    ob.o.ix = prop.property('Offset').propertyIndex;
                    ob.m = prop.property('Composite').value;
                    ob.ix = prop.propertyIndex;
                    var trOb = {};
                    var transformProperty = prop.property('Transform');
                    trOb.ty = 'tr';
                    trOb.p = bm_keyframeHelper.exportKeyframes(transformProperty.property('Position'), frameRate, stretch);
                    trOb.p.ix = transformProperty.property('Position').propertyIndex;
                    trOb.a = bm_keyframeHelper.exportKeyframes(transformProperty.property('Anchor Point'), frameRate, stretch);
                    trOb.a.ix = transformProperty.property('Anchor Point').propertyIndex;
                    trOb.s = bm_keyframeHelper.exportKeyframes(transformProperty.property('Scale'), frameRate, stretch);
                    trOb.s.ix = transformProperty.property('Scale').propertyIndex;
                    trOb.r = bm_keyframeHelper.exportKeyframes(transformProperty.property('Rotation'), frameRate, stretch);
                    trOb.r.ix = transformProperty.property('Rotation').propertyIndex;
                    trOb.so = bm_keyframeHelper.exportKeyframes(transformProperty.property('Start Opacity'), frameRate, stretch);
                    trOb.so.ix = transformProperty.property('Start Opacity').propertyIndex;
                    trOb.eo = bm_keyframeHelper.exportKeyframes(transformProperty.property('End Opacity'), frameRate, stretch);
                    trOb.eo.ix = transformProperty.property('End Opacity').propertyIndex;
                    trOb.nm = transformProperty.name;
                    ob.tr = trOb;
                } else if (itemType === shapeItemTypes.merge) {
                    ob = {};
                    ob.ty = itemType;
                    ob.mm = prop.property('ADBE Vector Merge Type').value;
                } else if (itemType === shapeItemTypes.trim) {
                    ob = {};
                    ob.ty = itemType;
                    ob.s = bm_keyframeHelper.exportKeyframes(prop.property('Start'), frameRate, stretch);
                    ob.s.ix = prop.property('Start').propertyIndex;
                    ob.e = bm_keyframeHelper.exportKeyframes(prop.property('End'), frameRate, stretch);
                    ob.e.ix = prop.property('End').propertyIndex;
                    ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Offset'), frameRate, stretch);
                    ob.o.ix = prop.property('Offset').propertyIndex;
                    ob.m = prop.property('Trim Multiple Shapes').value;
                    ob.ix = prop.propertyIndex;
                } else if (itemType === shapeItemTypes.twist) {
                    ob = {};
                    ob.ty = itemType;
                    bm_generalUtils.iterateProperty(prop);
                    ob.a = bm_keyframeHelper.exportKeyframes(prop.property('ADBE Vector Twist Angle'), frameRate, stretch);
                    ob.a.ix = prop.property('ADBE Vector Twist Angle').propertyIndex;
                    ob.c = bm_keyframeHelper.exportKeyframes(prop.property('ADBE Vector Twist Center'), frameRate, stretch);
                    ob.c.ix = prop.property('ADBE Vector Twist Center').propertyIndex;
                    /*ob.e = bm_keyframeHelper.exportKeyframes(prop.property('End'), frameRate, stretch);
                    ob.e.ix = prop.property('End').propertyIndex;
                    ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Offset'), frameRate, stretch);
                    ob.o.ix = prop.property('Offset').propertyIndex;
                    ob.m = prop.property('Trim Multiple Shapes').value;*/
                    ob.ix = prop.propertyIndex;
                } else if (itemType === shapeItemTypes.group) {
                    ob = {
                        ty : itemType,
                        it: [],
                        nm: prop.name,
                        np: prop.property('Contents').numProperties,
                        cix: prop.property('Contents').propertyIndex,
                        ix: prop.propertyIndex
                    };
                    navigationShapeTree.push(prop.name);
                    iterateProperties(prop.property('Contents'), ob.it, frameRate, stretch, isText);
                    if (!isText) {
                        var trOb = {};
                        var transformProperty = prop.property('Transform');
                        trOb.ty = 'tr';
                        trOb.p = bm_keyframeHelper.exportKeyframes(transformProperty.property('Position'), frameRate, stretch);
                        trOb.p.ix = transformProperty.property('Position').propertyIndex;
                        trOb.a = bm_keyframeHelper.exportKeyframes(transformProperty.property('Anchor Point'), frameRate, stretch);
                        trOb.a.ix = transformProperty.property('Anchor Point').propertyIndex;
                        trOb.s = bm_keyframeHelper.exportKeyframes(transformProperty.property('Scale'), frameRate, stretch);
                        trOb.s.ix = transformProperty.property('Scale').propertyIndex;
                        trOb.r = bm_keyframeHelper.exportKeyframes(transformProperty.property('Rotation'), frameRate, stretch);
                        trOb.r.ix = transformProperty.property('Rotation').propertyIndex;
                        trOb.o = bm_keyframeHelper.exportKeyframes(transformProperty.property('Opacity'), frameRate, stretch);
                        trOb.o.ix = transformProperty.property('Opacity').propertyIndex;
                        if(transformProperty.property('Skew').canSetExpression) {
                            trOb.sk = bm_keyframeHelper.exportKeyframes(transformProperty.property('Skew'), frameRate, stretch);
                            trOb.sk.ix = transformProperty.property('Skew').propertyIndex;
                            trOb.sa = bm_keyframeHelper.exportKeyframes(transformProperty.property('Skew Axis'), frameRate, stretch);
                            trOb.sa.ix = transformProperty.property('Skew Axis').propertyIndex;
                        }
                        trOb.nm = transformProperty.name;
                        ob.it.push(trOb);
                    }
                    navigationShapeTree.pop();
                } else if (itemType === shapeItemTypes.roundedCorners) {
                    ob = {
                        ty : itemType,
                        nm: prop.name
                    };
                    ob.r = bm_keyframeHelper.exportKeyframes(prop.property('Radius'), frameRate, stretch);
                }
                if (ob) {
                    ob.nm = prop.name;
                    ob.mn = prop.matchName;
                    var layerAttributes = bm_generalUtils.findAttributes(prop.name);
                    if(layerAttributes.ln){
                        ob.ln = layerAttributes.ln;
                    }
                    if(layerAttributes.cl){
                        ob.cl = layerAttributes.cl;
                    }
                    array.push(ob);
                }
            }
            
        }
    }

    function exportGradientData(ob,prop, navigationShapeTree){
        var property = prop.property('Colors');
        var gradientData = bm_ProjectHelper.getGradientData(navigationShapeTree, property.numKeys);
        ob.g = {
            p:gradientData.p,
            k:property
        };
        ob.s = prop.property('Start Point');
        ob.e = prop.property('End Point');
        ob.t = prop.property('Type').value;
        if(ob.t === 2){
            ob.h = prop.property('Highlight Length');
            ob.a = prop.property('Highlight Angle');
        }
    }
    
    ob.iterateProperties = iterateProperties;

    return ob;
}());
