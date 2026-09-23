import express from "express";
import ExcelJS from "exceljs";
import { isUserValid } from "../utils/auth-util.js";
import Product from "../models/Product.js";
import { getErrorMessage } from "../utils/error-util.js";

const router = express.Router();

router.get("/export", async (req, res) => {
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid && data.isAdmin) {
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

        res.setHeader("Content-Type", "routerlication/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

        await workbook.xlsx.write(res);
        return res.end();
    }
    else {
        return res.status(401).send({ message });
    }
});

router.post("/create", async (req, res) => {
    const { title, images, price, description, inStock, company, type, typeDetails } = req.body;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    const imagesArray = images.split(",").map(image => image.trim());

    if (isValid && data.isAdmin) {
        try {
            await Product.create({ title, images: imagesArray, price, description, inStock, company, type, typeDetails });
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        return res.status(201).send({ message: "productCreated" });
    }
    else {
        return res.status(401).send({ message });
    }
});

router.post("/changeInStock/:id", async (req, res) => {
    const { changedStock } = req.body;
    const productId = req.params.id;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid && data.isAdmin) {
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
    }
    else {
        return res.status(401).send({ message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const productId = req.params.id;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);

    if (isValid && data.isAdmin) {
        try {
            await Product.findByIdAndDelete(productId);
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        return res.status(201).send({ message: "productDeleted" });
    }
    else {
        return res.status(401).send({ message });
    }
});

router.put("/change/:id", async (req, res) => {
    const productId = req.params.id;
    const [isValid, message, data] = await isUserValid(req.headers["x-authorization"]);
    const { title, images, price, description, inStock, company, type, typeDetails } = req.body;
    const imagesArray = images.split(",").map(image => image.trim());

    if (isValid && data.isAdmin) {
        try {
            await Product.findByIdAndUpdate(productId, { title, images: imagesArray, price, description, inStock, company, type, typeDetails }, { runValidators: true });
        }
        catch (err) {
            console.error(err);
            return res.status(400).send({ message: getErrorMessage(err) });
        }

        return res.status(201).send({ message: "productUpdated" });
    }
    else {
        return res.status(401).send({ message });
    }
});

export default router;