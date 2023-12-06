const express = require("express");
// const { verify } = require("crypto");
const Func = require("../functions/functions");
const sequelize = require("../../config/db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cache = require("../../config/node-cache");
const path = require("path");

// Controllers
const UserControllers = require("../controller/usersController");
const UserAddressControllers = require("../controller/usersAddressController");
const AdminControllers = require("../controller/adminController");
const SubAdminControllers = require("../controller/subAdminController");
const CatOfMarketsControllers = require("../controller/categoryOfMarketsController");
const MarketsControllers = require("../controller/marketController");
const CategoryControllers = require("../controller/categoryController");
const SubCategoryControllers = require("../controller/subCategoryController");
const BrandsControllers = require("../controller/brandController");
const ProductControllers = require("../controller/productController");
const OrderControllers = require("../controller/orderCantroller");
const CarouselControllers = require("../controller/carouselController");
const BannerControllers = require("../controller/bannerController");
const BannerCardControllers = require("../controller/bannerCardController");

// For Token

const verifyToken = async (req, res, next) => {
  const bearerHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, Func.Secret(), (err, authData) => {
      if (err) {
        res.json("err");
        console.log(err);
      } else {
        req.id = authData.id;
      }
    });
    next();
  } else {
    res.send("<center><h2>This link was not found! :(</h2></center>");
  }
};

// // Routes

// User Routes
router.get(
  "/user/all",
  verifyToken,
  cache.get,
  UserControllers.getAll,
  cache.set
);
router.get(
  "/user/:id",
  verifyToken,
  cache.get,
  UserControllers.getOne,
  cache.set
);
router.post("/user/create", UserControllers.create);
router.post("/user/login", UserControllers.login);
router.patch("/user/update", verifyToken, UserControllers.update);
router.patch("/user/disActive/:id", verifyToken, UserControllers.disActive);
router.patch("/user/active/:id", verifyToken, UserControllers.Active);
router.patch("/user/delete/:id", verifyToken, UserControllers.Delete);
router.delete("/user/destroy/:id", verifyToken, UserControllers.Destroy);
router.post("/user/check", UserControllers.checkCode);

// User Address Routes
router.get(
  "/address/all",
  verifyToken,
  cache.get,
  UserAddressControllers.getAll,
  cache.set
);
router.get(
  "/address/:id",
  verifyToken,
  cache.get,
  UserAddressControllers.getOne,
  cache.set
);
router.post("/address/create", verifyToken, UserAddressControllers.create);
router.patch("/address/update", verifyToken, UserAddressControllers.update);
router.delete(
  "/address/destroy/:id",
  verifyToken,
  UserAddressControllers.Destroy
);

// Admin Routes
router.get(
  "/admin/all",
  verifyToken,
  cache.get,
  AdminControllers.getAll,
  cache.set
);
router.get(
  "/admin/:id",
  verifyToken,
  cache.get,
  AdminControllers.getOne,
  cache.set
);
router.post("/admin/create", AdminControllers.create);
router.post("/admin/login", AdminControllers.login);
router.patch("/admin/update", verifyToken, AdminControllers.update);
router.patch("/admin/disActive/:id", verifyToken, AdminControllers.disActive);
router.patch("/admin/active/:id", verifyToken, AdminControllers.Active);
router.patch("/admin/delete/:id", verifyToken, AdminControllers.Delete);
router.delete("/admin/destroy/:id", verifyToken, AdminControllers.Destroy);
router.post("/admin/check", AdminControllers.checkCode);

// SubAdmin Routes
router.get(
  "/subAdmin/all",
  verifyToken,
  cache.get,
  SubAdminControllers.getAll,
  cache.set
);
router.get(
  "/subAdmin/:id",
  verifyToken,
  cache.get,
  SubAdminControllers.getOne,
  cache.set
);
router.post("/subAdmin/create", verifyToken, SubAdminControllers.create);
router.post("/subAdmin/login", SubAdminControllers.login);
router.patch("/subAdmin/update", verifyToken, SubAdminControllers.update);
router.patch(
  "/subAdmin/disActive/:id",
  verifyToken,
  SubAdminControllers.disActive
);
router.patch("/subAdmin/active/:id", verifyToken, SubAdminControllers.Active);
router.patch("/subAdmin/delete/:id", verifyToken, SubAdminControllers.Delete);
router.delete(
  "/subAdmin/destroy/:id",
  verifyToken,
  SubAdminControllers.Destroy
);
router.post("/subAdmin/check", SubAdminControllers.checkCode);

//  Category of Markets Routes
router.get(
  "/catOfMarkets/all",
  cache.get,
  CatOfMarketsControllers.getAll,
  cache.set
);
router.get(
  "/catOfMarkets/:id",
  cache.get,
  CatOfMarketsControllers.getOne,
  cache.set
);
router.post(
  "/catOfMarkets/create",
  verifyToken,
  CatOfMarketsControllers.create
);
router.patch(
  "/catOfMarkets/update",
  verifyToken,
  CatOfMarketsControllers.update
);
router.patch(
  "/catOfMarkets/delete/:id",
  verifyToken,
  CatOfMarketsControllers.Delete
);
router.patch(
  "/catOfMarkets/unDelete/:id",
  verifyToken,
  CatOfMarketsControllers.unDelete
);
router.delete(
  "/catOfMarkets/destroy/:id",
  verifyToken,
  CatOfMarketsControllers.Destroy
);

// Markets Routes
router.get("/market/all", cache.get, MarketsControllers.getAll, cache.set);
router.get("/market/:id", cache.get, MarketsControllers.getOne, cache.set);
router.post("/market/create", verifyToken, MarketsControllers.create);
router.patch("/market/update", verifyToken, MarketsControllers.update);
router.patch("/market/delete/:id", verifyToken, MarketsControllers.Delete);
router.patch("/market/unDelete/:id", verifyToken, MarketsControllers.unDelete);
router.delete("/market/destroy/:id", verifyToken, MarketsControllers.Destroy);

// Markets Categories Routes
router.get("/category/all", cache.get, CategoryControllers.getAll, cache.set);
router.get("/category/:id", cache.get, CategoryControllers.getOne, cache.set);
router.post("/category/create", verifyToken, CategoryControllers.create);
router.patch("/category/update", verifyToken, CategoryControllers.update);
router.patch("/category/delete/:id", verifyToken, CategoryControllers.Delete);
router.patch(
  "/category/unDelete/:id",
  verifyToken,
  CategoryControllers.unDelete
);
router.delete(
  "/category/destroy/:id",
  verifyToken,
  CategoryControllers.Destroy
);

// Markets SubCategories Routes
router.get(
  "/subCategory/all",
  cache.get,
  SubCategoryControllers.getAll,
  cache.set
);
router.get(
  "/subCategory/:id",
  cache.get,
  SubCategoryControllers.getOne,
  cache.set
);
router.post("/subCategory/create", verifyToken, SubCategoryControllers.create);
router.patch("/subCategory/update", verifyToken, SubCategoryControllers.update);
router.patch(
  "/subCategory/delete/:id",
  verifyToken,
  SubCategoryControllers.Delete
);
router.patch(
  "/subCategory/unDelete/:id",
  verifyToken,
  SubCategoryControllers.unDelete
);
router.delete(
  "/subCategory/destroy/:id",
  verifyToken,
  SubCategoryControllers.Destroy
);

// Brands Routes
router.get("/brand/all", cache.get, BrandsControllers.getAll, cache.set);
router.get("/brand/:id", cache.get, BrandsControllers.getOne, cache.set);
router.post("/brand/create", verifyToken, BrandsControllers.create);
router.patch("/brand/update", verifyToken, BrandsControllers.update);
router.patch("/brand/delete/:id", verifyToken, BrandsControllers.Delete);
router.patch("/brand/unDelete/:id", verifyToken, BrandsControllers.unDelete);
router.delete("/brand/destroy/:id", verifyToken, BrandsControllers.Destroy);

// Products Routes
router.get("/product/all", cache.get, ProductControllers.getAll, cache.set);
router.get("/product/:id", cache.get, ProductControllers.getOne, cache.set);
router.post("/product/create", verifyToken, ProductControllers.create);
router.post("/product/upl-img/:id", verifyToken, ProductControllers.uploadsImg);
router.post(
  "/product/upl-video/:id",
  verifyToken,
  ProductControllers.uploadsVideo
);
router.delete(
  "/product/del-img/:id",
  verifyToken,
  ProductControllers.deleteProductImg
);
router.delete(
  "/product/del-video/:id",
  verifyToken,
  ProductControllers.deleteProductVideo
);
router.patch("/product/update", verifyToken, ProductControllers.update);
router.patch("/product/delete/:id", verifyToken, ProductControllers.Delete);
router.patch("/product/unDelete/:id", verifyToken, ProductControllers.unDelete);
router.delete("/product/destroy/:id", verifyToken, ProductControllers.Destroy);

// Order Routes
router.get(
  "/order/all",
  verifyToken,
  cache.get,
  OrderControllers.getAll,
  cache.set
);
router.get(
  "/order/:id",
  verifyToken,
  cache.get,
  OrderControllers.getOne,
  cache.set
);
router.post("/order/create", verifyToken, OrderControllers.create);
router.patch("/order/update", verifyToken, OrderControllers.update);
router.patch("/order/update/pro", verifyToken, OrderControllers.update);
router.patch("/order/delete/:id", verifyToken, OrderControllers.Delete);
router.patch("/order/unDelete/:id", verifyToken, OrderControllers.unDelete);
router.delete("/order/destroy/:id", verifyToken, OrderControllers.Destroy);

// Carousel Routes
router.get("/carousel/all", cache.get, CarouselControllers.getAll, cache.set);
router.get("/carousel/:id", cache.get, CarouselControllers.getOne, cache.set);
router.post("/carousel/create", verifyToken, CarouselControllers.create);
router.patch("/carousel/update", verifyToken, CarouselControllers.update);
router.delete(
  "/carousel/destroy/:id",
  verifyToken,
  CarouselControllers.Destroy
);

// Banner Routes
router.get("/banner/all", cache.get, BannerControllers.getAll, cache.set);
router.get("/banner/:id", cache.get, BannerControllers.getOne, cache.set);
router.post("/banner/create", verifyToken, BannerControllers.create);
router.patch("/banner/update", verifyToken, BannerControllers.update);
router.delete("/banner/destroy/:id", verifyToken, BannerControllers.Destroy);

// BannerCard Routes
router.get(
  "/bannerCard/all",
  cache.get,
  BannerCardControllers.getAll,
  cache.set
);
router.get(
  "/bannerCard/:id",
  cache.get,
  BannerCardControllers.getOne,
  cache.set
);
router.post("/bannerCard/create", verifyToken, BannerCardControllers.create);
router.patch("/bannerCard/update", verifyToken, BannerCardControllers.update);
router.delete(
  "/bannerCard/destroy/:id",
  verifyToken,
  BannerCardControllers.Destroy
);

module.exports = router;
