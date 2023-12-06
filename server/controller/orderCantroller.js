var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  Order,
  OrderProduct,
  User,
  Market,
  Product,
  ProductImg,
  ProductVideo,
  Category,
  Brand,
  Orderlog,
} = require("../../models/index.js");

const fs = require("fs");
const orderlog = require("../../models/orderlog");

const getAll = async (req, res) => {
  const { status, code, admin_note, active, deleted } = req.query;

  const Status =
    status &&
    (status?.length > 0
      ? {
          status: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("status")),
            "LIKE",
            "%" + status.toLowerCase() + "%"
          ),
        }
      : null);
  const Code =
    code &&
    (code?.length > 0
      ? {
          code: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("code")),
            "LIKE",
            "%" + code.toLowerCase() + "%"
          ),
        }
      : null);
  const Admin_note =
    admin_note &&
    (admin_note?.length > 0
      ? {
          admin_note: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("admin_note")),
            "LIKE",
            "%" + admin_note.toLowerCase() + "%"
          ),
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

  Order.findAll({
    include: [
      {
        model: Market,
      },
      {
        model: User,
      },
      {
        model: OrderProduct,
        include: [
          {
            model: Product,
            include: [
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
                model: Brand,
              },
            ],
          },
        ],
      },
    ],

    where: {
      [Op.and]: [Status, Code, Admin_note, Active, Deleted],
    },
    order: [["id", "DESC"]],
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
    Order.findOne({
      include: [
        {
          model: Market,
        },
        {
          model: User,
        },
        {
          model: OrderProduct,
          include: [
            {
              model: Product,
              include: [
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
                  model: Brand,
                },
              ],
            },
          ],
        },
      ],

      where: { id: id },
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
    code,
    address,
    note,
    admin_note,
    awans,
    massa,
    massa_price,
    MarketId,
    UserId,
    orderProduct,
  } = req.body;

  let orderedProducts = [];
  let price = 0;
  let discount_price = 0;
  const Market = await Market.findOne({ where: { id: MarketId } });
  await orderProduct?.map(async (item) => {
    const product = await Product.findOne({ where: { id: item.ProductId } });

    let proPrice = product?.is_valyuta
      ? (product?.usd_price * Market?.valyuta * item?.quantity).toFixed(2)
      : (product?.price * item?.quantity).toFixed(2);
    price = price + proPrice;

    let proDiscount_price = product?.is_valyuta
      ? (product?.discount_usd * Market?.valyuta * item?.quantity).toFixed(2)
      : (product?.discount_price * item?.quantity).toFixed(2);
    discount_price = discount_price + proDiscount_price;

    orderedProducts.push({
      quantity: item?.quantity,
      price: proPrice,
      discount_price: proDiscount_price,
      massa: item?.massa ? item?.massa : 0,
      massa_price: item?.massa_price ? item?.massa_price : 0,
      ProductId: product?.id,
      OrderId: 0,
    });
  });
  Order.create({
    price,
    discount_price,
    delivery_price: Market?.delivery_price,
    status: 1,
    code,
    address,
    note,
    admin_note,
    awans,
    massa,
    massa_price,
    MarketId,
    UserId,
  })
    .then(async (data) => {
      await orderedProducts?.map((item) => {
        item.OrderId = data.id;
      });
      OrderProduct.bulkCreate(orderedProducts, { returning: true })
        .then(async (ordered) => {
          res.json({ order: data, orderedPro: ordered });
        })
        .catch((err) => {
          console.log(err);
          res.json("create OrderedPro:", err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json("create Order:", err);
    });
};

const update = async (req, res) => {
  const {
    status,
    code,
    address,
    note,
    admin_note,
    awans,
    massa,
    massa_price,
    id,
  } = req.body;

  const data = await Order.findOne({ where: { id: id } });
  if (!data) {
    res.json("Bu Id boyuncha Product yok!");
  } else {
    Order.update(
      {
        status,
        code,
        address,
        note,
        admin_note,
        awans,
        massa,
        massa_price,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(async () => {
        await Orderlog.create({
          ipAddress: "",
          description:
            "Order edited status, code, address, note, admin_note, awans, massa, massa_price",
          edited: JSON.stringify({
            status,
            code,
            address,
            note,
            admin_note,
            awans,
            massa,
            massa_price,
          }),
          oldData: JSON.stringify(data),
          OrderId: id,
          MarketId: data.MarketId,
          // UserId:
          // AdminId:
        });
        res.json("updated");
      })
      .catch((err) => {
        console.log(err);
        res.json("update Order:", err);
      });
  }
};

const updateOrderProduct = async (req, res) => {
  const { massa, massa_price, id } = req.body;

  const data = await OrderProduct.findOne({
    include: [{ model: Order, include: [{ model: Market }] }],
    where: { id: id },
  });
  if (!data) {
    res.json("Bu Id boyuncha OrderProduct yok!");
  } else {
    let oldmassa = 0;
    let oldmassa_price = 0;
    const orderedPros = await OrderProduct.findAll({
      where: { OrderId: data?.OrderId },
    });
    await orderedPros?.map((item) => {
      oldmassa = oldmassa + item?.massa;
      oldmassa_price = oldmassa_price + item?.massa_price;
    });
    OrderProduct.update(
      {
        massa,
        massa_price,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(async () => {
        let newmassa = oldmassa;
        let newmassa_price = oldmassa_price;
        const orderedPros = await OrderProduct.findAll({
          where: { OrderId: data?.OrderId },
        });
        await orderedPros?.map((item) => {
          newmassa = newmassa + item?.massa;
          newmassa_price = newmassa_price + item?.massa_price;
        });
        Order.update(
          {
            massa: newmassa,
            massa_price: newmassa_price,
          },
          { where: { id: data?.OrderId } }
        )
          .then(async () => {
            await Orderlog.create({
              ipAddress: "",
              description: " Edited orderedProducts massa, massa_price",
              edited: JSON.stringify({
                newmassa,
                newmassa_price,
              }),
              oldData: JSON.stringify({ oldmassa, oldmassa_price }),
              OrderId: data?.OrderId,
              MarketId: data?.Order?.MarketId,
              // UserId:
              // AdminId:
            });
            res.json("updated");
          })
          .catch((err) => {
            console.log(err);
            res.json("update Order:", err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.json("update OrderedProduct:", err);
      });
  }
};

const unDelete = async (req, res) => {
  const { id } = req.params;
  const data = await Order.findOne({
    include: [{ model: OrderProduct }],
    where: { id },
  });
  if (data) {
    Order.update({
      deleted: false,
      active: true,
      where: {
        id,
      },
    })
      .then(async () => {
        await Orderlog.create({
          ipAddress: "",
          description: "Order undeleted",
          edited: JSON.stringify(data),
          oldData: JSON.stringify(data),
          OrderId: id,
          MarketId: data?.MarketId,
          // UserId:
          // AdminId:
        });
        res.json("undeleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha Order yok!");
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  const data = await Order.findOne({
    include: [{ model: OrderProduct }],
    where: { id },
  });
  if (data) {
    Order.update({
      deleted: true,
      active: false,
      where: {
        id,
      },
    })
      .then(async () => {
        await Orderlog.create({
          ipAddress: "",
          description: "Order deleted",
          edited: JSON.stringify(data),
          oldData: JSON.stringify(data),
          OrderId: id,
          MarketId: data?.MarketId,
          // UserId:
          // AdminId:
        });
        res.json("deleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha Order yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;
  const data = await Order.findOne({
    include: [{ model: OrderProduct }],
    where: { id },
  });
  if (data) {
    Order.destroy({
      where: {
        id,
      },
    })
      .then(async () => {
        await Orderlog.create({
          ipAddress: "",
          description: "Order destroyed",
          edited: JSON.stringify(data),
          oldData: JSON.stringify(data),
          OrderId: id,
          MarketId: data?.MarketId,
          // UserId:
          // AdminId:
        });
        res.json("destroyed!");
      })
      .catch((err) => {
        console.log(err);
        res.json({ err: err });
      });
  } else {
    res.json("Bu Id Boyuncha Order yok!");
  }
};
exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.updateOrderProduct = updateOrderProduct;
exports.Delete = Delete;
exports.unDelete = unDelete;
exports.Destroy = Destroy;
