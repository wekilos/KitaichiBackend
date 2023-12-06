var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  Category,
  SubCategory,
  Market,
  Product,
  Brand,
  ProductImg,
  ProductVideo,
} = require("../../models/index.js");

const fs = require("fs");

const getAll = async (req, res) => {
  const {
    name,
    active,
    deleted,
    MarketId,
    CategoryId,
    SubCategoryId,
    BrandId,
    is_discount,
    on_hand,
    is_moresale,
  } = req.query;

  const Title =
    name &&
    (name?.length > 0
      ? {
          [Op.or]: [
            {
              name_tm: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("name_tm")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
            {
              name_ru: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("name_ru")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
            {
              name_en: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("name_en")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
            {
              description_tm: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("description_tm")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
            {
              description_ru: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("description_ru")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
            {
              description_en: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("description_en")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
            {
              code: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("code")),
                "LIKE",
                "%" + name.toLowerCase() + "%"
              ),
            },
          ],
        }
      : null);

  const Active =
    active &&
    (active
      ? {
          active: active,
        }
      : {
          active: true,
        });

  const Deleted =
    deleted &&
    (deleted
      ? {
          deleted: deleted,
        }
      : {
          deleted: false,
        });

  const MarketID =
    MarketId &&
    (MarketId
      ? {
          MarketId: MarketId,
        }
      : null);
  const CategoryID =
    CategoryId &&
    (CategoryId
      ? {
          CategoryId: CategoryId,
        }
      : null);
  const SubCategoryID =
    SubCategoryId &&
    (SubCategoryId
      ? {
          SubCategoryId: SubCategoryId,
        }
      : null);
  const BrandID =
    BrandId &&
    (BrandId
      ? {
          BrandId: BrandId,
        }
      : null);
  const Is_discount =
    is_discount &&
    (is_discount
      ? {
          is_discount: is_discount,
        }
      : null);
  const On_hand =
    on_hand &&
    (on_hand
      ? {
          on_hand: on_hand,
        }
      : null);
  const Is_moresale =
    is_moresale &&
    (is_moresale
      ? {
          is_moresale: is_moresale,
        }
      : null);

  Product.findAll({
    include: [
      {
        model: Market,
      },
      {
        model: ProductImg,
      },
      {
        model: ProductVideo,
      },
      {
        model: Category,
      },
      {
        model: SubCategory,
      },
      {
        model: Brand,
      },
    ],

    where: {
      [Op.and]: [
        Title,
        Active,
        Deleted,
        MarketID,
        CategoryID,
        SubCategoryID,
        BrandID,
        Is_discount,
        On_hand,
        Is_moresale,
      ],
    },
    order: [["orderNum", "ASC"]],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: err });
    });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const data = await Product.findOne({ where: { id: id } });
  if (data) {
    Product.findOne({
      include: [
        {
          model: Market,
        },
        {
          model: Category,
        },
        {
          model: SubCategory,
        },
        {
          model: Brand,
        },
        {
          model: ProductImg,
        },
        { model: ProductVideo },
      ],
      where: {
        id: id,
      },
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ error: err });
      });
  } else {
    res.send("BU ID boyuncha Product yok!");
  }
};

const create = async (req, res) => {
  const {
    name_tm,
    name_ru,
    name_en,
    description_ru,
    description_tm,
    description_en,
    price,
    usd_price,
    is_discount,
    discount,
    discount_price,
    discount_usd,
    quantity,
    on_hand,
    code,
    is_moresale,
    link,
    orderNum,
    is_valyuta,
    is_selected,
    is_favorite,
    is_top,
    MarketId,
    CategoryId,
    SubCategoryId,
    BrandId,
  } = req.body;

  const files =
    req.files.img.constructor === Array ? req.files.img : [req.files.img];
  console.log("filessss>>>>>>", typeof files);
  console.log("files", files);

  let imgs = [];
  const upl = (img, id) => {
    let randomNumber = Math.floor(Math.random() * 999999999999);
    let img_direction = `./uploads/` + randomNumber + `${img.name}`;
    fs.writeFile(img_direction, img.data, function (err) {
      console.log(err);
    });
    imgs.push({ src: img_direction, ProductId: id });
  };

  Product.create({
    name_tm,
    name_ru,
    name_en,
    description_ru,
    description_tm,
    description_en,
    price,
    is_valyuta,
    usd_price,
    is_discount,
    discount,
    discount_price,
    discount_usd,
    quantity,
    on_hand,
    code,
    is_moresale,
    link,
    orderNum,
    is_selected,
    is_favorite,
    is_top,
    MarketId,
    CategoryId,
    SubCategoryId,
    BrandId,
  })
    .then(async (data) => {
      // res.json(data);
      await files?.map((item) => {
        upl(item, data.id);
      });
      ProductImg.bulkCreate(imgs, { returning: true })
        .then((proIMMMM) => {
          res.status(200).json({ data, proIMMMM });
        })
        .catch((err) => {
          console.log(err);
          res.json("create Product:", err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json("create Product:", err);
    });
};

const update = async (req, res) => {
  const {
    name_tm,
    name_ru,
    name_en,
    description_ru,
    description_tm,
    description_en,
    price,
    is_valyuta,
    usd_price,
    is_discount,
    discount,
    discount_price,
    discount_usd,
    quantity,
    on_hand,
    code,
    is_moresale,
    link,
    orderNum,
    is_selected,
    is_favorite,
    is_top,
    MarketId,
    CategoryId,
    SubCategoryId,
    BrandId,
    id,
  } = req.body;

  const data = await Product.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Product yok!");
  } else {
    Product.update(
      {
        name_tm,
        name_ru,
        name_en,
        description_ru,
        description_tm,
        description_en,
        price,
        usd_price,
        is_discount,
        discount,
        discount_price,
        discount_usd,
        quantity,
        on_hand,
        code,
        is_valyuta,
        is_selected,
        is_favorite,
        is_top,
        is_moresale,
        link,
        orderNum,
        MarketId,
        CategoryId,
        SubCategoryId,
        BrandId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(async (data) => {
        res.json("updated");
      })
      .catch((err) => {
        console.log(err);
        res.json("update Product:", err);
      });
  }
};

const deleteProductImg = async (req, res) => {
  const { id } = req.params;

  const data = await ProductImg.findOne({ where: { id: id } });
  if (!data) {
    res.json("BU ID boyuncha Product IMG yok!!!");
  } else {
    await fs.unlink(data.src, (err) => {
      console.log(err);
    });
    ProductImg.destroy({ where: { id: id } })
      .then((data) => {
        res.json("DEleted IMG");
      })
      .catch((err) => {
        res.json(data);
      });
  }
};

const uploadsImg = async (req, res) => {
  const { id } = req.params;
  const files =
    req.files.img.constructor === Array ? req.files.img : [req.files.img];
  console.log("filessss>>>>>>", typeof files);
  console.log("files", files);

  let imgs = [];
  const upl = (img) => {
    let randomNumber = Math.floor(Math.random() * 999999999999);
    let img_direction = `./uploads/` + randomNumber + `${img.name}`;
    fs.writeFile(img_direction, img.data, function (err) {
      console.log(err);
    });
    imgs.push({ src: img_direction, ProductId: id });
  };

  files?.map((item) => {
    upl(item);
  });

  ProductImg.bulkCreate(imgs, { returning: true })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create ProductImg:", err);
    });
};

const uploadsVideo = async (req, res) => {
  const { id } = req.params;
  const files =
    req.files.img.constructor === Array ? req.files.img : [req.files.img];
  console.log("filessss>>>>>>", typeof files);
  console.log("files", files);

  let imgs = [];
  const upl = (img) => {
    let randomNumber = Math.floor(Math.random() * 999999999999);
    let img_direction = `./uploads/` + randomNumber + `${img.name}`;
    fs.writeFile(img_direction, img.data, function (err) {
      console.log(err);
    });
    imgs.push({ src: img_direction, ProductId: id });
  };

  files?.map((item) => {
    upl(item);
  });

  ProductVideo.bulkCreate(imgs, { returning: true })
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json("create ProductVideo:", err);
    });
};

const deleteProductVideo = async (req, res) => {
  const { id } = req.params;

  const data = await ProductVideo.findOne({ where: { id: id } });
  if (!data) {
    res.json("BU ID boyuncha Product Video yok!!!");
  } else {
    await fs.unlink(data.src, (err) => {
      console.log(err);
    });
    ProductVideo.destroy({ where: { id: id } })
      .then((data) => {
        res.json("Deleted Video");
      })
      .catch((err) => {
        res.json(data);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  let data = await Product.findOne({ where: { id } });
  if (data) {
    Product.update(
      {
        deleted: false,
        active: true,
      },
      {
        where: {
          id,
        },
      }
    )
      .then(() => {
        res.json("undeleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha Product yok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  let data = await Product.findOne({ where: { id } });
  if (data) {
    Product.update(
      {
        deleted: true,
        active: false,
      },
      {
        where: {
          id,
        },
      }
    )
      .then(() => {
        res.json("deleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha Product yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Product.findOne({
    include: [{ model: ProductImg }, { model: ProductVideo }],
    where: { id },
  });
  if (data) {
    if (data.ProductImg?.length > 0) {
      data.ProductImg.map((item) => {
        fs.unlink(item?.src, function (err) {
          console.log(err);
        });
      });
    }
    if (data.ProductVideo?.length > 0) {
      data.ProductVideo.map((item) => {
        fs.unlink(item?.src, function (err) {
          console.log(err);
        });
      });
    }

    Product.destroy({
      where: {
        id,
      },
    })
      .then(() => {
        res.json("destroyed!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha Product yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;
exports.uploadsImg = uploadsImg;
exports.deleteProductImg = deleteProductImg;
exports.uploadsVideo = uploadsVideo;
exports.deleteProductVideo = deleteProductVideo;
