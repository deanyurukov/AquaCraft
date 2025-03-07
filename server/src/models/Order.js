import { Schema, Types, model } from "mongoose";

const bulgarianCitiesAndTowns = [
    "sofia", "plovdiv", "varna", "burgas", "ruse", "stara zagora", "pleven", "sliven", "dobrich", "shumen",
    "pernik", "haskovo", "blagoevgrad", "yambol", "veliko tarnovo", "pazardzhik", "vratsa", "gabrovo", "asenovgrad",
    "vidin", "kazanlak", "kyustendil", "kardzhali", "montana", "dimitrovgrad", "lovech", "silistra", "targovishte",
    "dupnitsa", 
    "софия", "пловдив", "варна", "бургас", "русе", "стара загора", "плевен", "сливен", "добрич", "шумен",
    "перник", "хасково", "благоевград", "ямбол", "велико търново", "пазарджик", "враца", "габрово", "асеновград",
    "видин", "казанлък", "кюстендил", "кърджали", "монтана", "димитровград", "ловеч", "силистра", "търговище",
    "дупница"
];

const orderSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Попълнете всички полета!"],
            minLength: [5, "Имейлът трябва да е поне 5 символа!"],
            maxLength: [99, "Имейлът не може да бъде над 99 символа!"],
            match: [/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, "Имейлът е невалиден!"],
        },
        name: {
            type: String,
            required: [true, "Попълнете всички полета!"],
            minLength: [3, "Името трябва да е поне 3 символа!"],
            maxLength: [99, "Името не може да бъде над 99 символа!"],
            match: [/^[а-яА-Яa-zA-z\s]+$/, "Името трябва да включва само букви!"],
        },
        phone: {
            type: String,
            required: [true, "Попълнете всички полета!"],
            match: [/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, "Невалиден тел. номер!"]
        },
        deliveryWay: {
            type: String,
            required: [true, "Попълнете всички полета!"],
            enum: {
                values: ["Speedy", "Econt", "DHL"],
                message: "Невалиден куриер!"
            },
        },
        town: {
            type: String,
            required: [true, "Попълнете всички полета!"],
            enum: {
                values: bulgarianCitiesAndTowns,
                message: "Невалиден град!",
            },
        },
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderData: [{
            _id: false,
            quantity: {
                type: Number,
                required: true,
            },
            product: {
                type: Types.ObjectId,
                ref: "Product",
                required: true,
            }
        }]
    },
    {
        timestamps: true,
    }
);

const Order = model("Order", orderSchema);
export default Order;