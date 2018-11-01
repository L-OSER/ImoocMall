var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/imoocmall')

//测试是否连接成功
mongoose.connection.on("connected",function () {
  console.log("MongoDB connected success.")
})

//失败
mongoose.connection.on("error",function () {
  console.log("MongoDB connected fail.")
})

//断开
mongoose.connection.on("disconnected",function () {
  console.log("MongoDB connected disconnected.")
})

//查询商品列表数据
router.get("/list",function (req,res,next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let priceLevel = req.param("priceLevel");
  let sort = req.param('sort');
  var priceGt = '',priceLte = '';
  let skip =(page-1)*pageSize;
  let params = {};
  if(priceLevel!='all'){
    switch (priceLevel){
      case '0':priceGt = 0;priceLte = 100;break;
      case '1':priceGt = 100;priceLte = 500;break;
      case '2':priceGt = 500;priceLte = 1000;break;
      case '3':priceGt = 1000;priceLte = 5000;break;
    }
    params = {
      salePrice:{
          $gt:priceGt,
          $lte:priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);  //查找所有数据
  goodsModel.sort({'salePrice':sort});  //1是升序,-1是降序

  goodsModel.exec({},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
});

//加入到购物车
router.post("/addCart",function (req,res,next) {
  //假设已经登录
  var userId = '100000077',productId = req.body.productId;
  var User = require('../models/user');

  //获取当前用户数据列表第一个用户
  User.findOne({userId:userId},function (err,userDoc) {
    if (err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      if(userDoc){
        let goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          if (item.productId == productId) {
            goodsItem = item;
            item.productNum ++;
          }
        });
        if (goodsItem){
          userDoc.save(function (err2,doc2) {
            if (err2){
              res.json({
                status:"1",
                msg:err2.message
              })
            }else{
              res.json({
                status:"0",
                msg:'',
                result:'suc'
              })
            }
          })
        } else{
          Goods.findOne({productId:productId},function (err1,doc) {
            if (err1){
              res.json({
                status:"1",
                msg:err1.message
              })
            }else{
              if (doc){
                //因为通过mongoose查询的结果为Document文档类型而并非对象类型，因此，虽然在后台可以获取到新增的doc.productNum与doc.checked属性，但其实并没有对doc进行更改。
                //只要将文档对象转换为Object对象即可，使用mongoose自带的Document.prototype.toObject()方法，或者使用JSON.stringify()方法，将doc转换为Object对象。
                var obj = doc.toObject();
                obj.productNum = 1;
                obj.checked = 1;
                userDoc.cartList.push(obj);
                userDoc.save(function (err2,doc2) {
                  if (err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:"0",
                      msg:'',
                      result:'suc'
                    })
                  }
                })
              }
            }
          });

        }
      }
    }
  })
});

module.exports = router;
