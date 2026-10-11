import express from "express";
import ExcelJS from "exceljs";
import Product from "../models/Product.js";
import { getErrorMessage } from "../utils/error-util.js";
import Order from "../models/Order.js";
import { requireAdmin } from "../middlewares/admin-middleware.js";

const router = express.Router();
router.use(requireAdmin);

router.get("/export", async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Products");
    const products = await Product.find();

    sheet.addRow(["Product Name", "In Stock", "ID"]).eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '91BA8D' },
        };
        cell.font = { bold: false, color: { argb: 'ffffff' }, name: "Arial", size: 15 };
        cell.border = {
            top: { style: 'double', color: { argb: 'ffffff' } },
            left: { style: 'double', color: { argb: 'ffffff' } },
            bottom: { style: 'double', color: { argb: 'ffffff' } },
            right: { style: 'double', color: { argb: 'ffffff' } }
        };
    });

    products.forEach(product => {
        sheet.addRow([product.title, product.inStock, product.id]).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffffff' },
            };
            cell.font = { bold: false, color: { argb: '91BA8D' }, name: "Arial", size: 14 };
            cell.border = {
                top: { style: 'double', color: { argb: '91BA8D' } },
                left: { style: 'double', color: { argb: '91BA8D' } },
                bottom: { style: 'double', color: { argb: '91BA8D' } },
                right: { style: 'double', color: { argb: '91BA8D' } }
            };
        });
    });

    sheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
            const cellLength = cell.value ? cell.value.toString().length : 0;
            if (cellLength > maxLength) {
                maxLength = cellLength;
            }
        });
        column.width = Math.ceil(maxLength * 1.24) + 2;
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

    await workbook.xlsx.write(res);
    return res.end();
});

router.post("/create", async (req, res) => {
    const { title, images, price, description, inStock, company, type, typeDetails } = req.body;
    const imagesArray = images.split(",").map(image => image.trim());

    try {
        const created = await Product.create({ title, images: imagesArray, price, description, inStock, company, type, typeDetails });
        return res.status(201).send({ message: "productCreated", data: created });
    }
    catch (err) {
        console.error(err);
        return res.status(400).send({ message: getErrorMessage(err) });
    }
});

router.post("/changeInStock/:id", async (req, res) => {
    const { changedStock } = req.body;
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);
        product.inStock += Number(changedStock);
        await product.save();
    }
    catch (err) {
        console.error(err);
        return res.status(400).send({ message: getErrorMessage(err) });
    }

    return res.status(201).send({ message: "productCreated" });
});

router.delete("/delete/:id", async (req, res) => {
    const productId = req.params.id;

    try {
        await Product.findByIdAndDelete(productId);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send({ message: getErrorMessage(err) });
    }

    return res.status(201).send({ message: "productDeleted" });
});

router.put("/change/:id", async (req, res) => {
    const productId = req.params.id;
    const { title, images, price, description, inStock, company, type, typeDetails } = req.body;
    const imagesArray = images.split(",").map(image => image.trim());

    try {
        const productEdited = await Product.findByIdAndUpdate(productId, { title, images: imagesArray, price, description, inStock, company, type, typeDetails }, { runValidators: true, new: true });
        return res.status(201).send({ message: "productUpdated", data: productEdited });
    }
    catch (err) {
        console.error(err);
        return res.status(400).send({ message: getErrorMessage(err) });
    }
});

router.get("/orders/all", async (req, res) => {
    try {
        const orders = await Order.find({}).sort("-createdAt").populate("orderData.product");
        return res.status(200).send({ data: orders });
    }
    catch (err) {
        console.error(err);
        return res.status(400).send({ message: getErrorMessage(err) });
    }
});

export default router;