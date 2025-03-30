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
            required: [true, "allFields"],
            minLength: [5, "email.short"],
            maxLength: [99, "email.long"],
            match: [/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, "email.invalid"],
        },
        name: {
            type: String,
            required: [true, "allFields"],
            minLength: [3, "name.short"],
            maxLength: [99, "name.long"],
            match: [/^[a-zа-яА-ЯA-Z0-9\s]+$/, "name.invalid"],
        },
        phone: {
            type: String,
            required: [true, "allFields"],
            match: [/^\+?359[\s]?8\d{2}[\s]?\d{3}[\s]?\d{3}$/, "phone.invalid"]
        },
        deliveryWay: {
            type: String,
            required: [true, "allFields"],
            enum: {
                values: ["Speedy", "Econt", "DHL"],
                message: "courier.invalid",
            },
        },
        town: {
            type: String,
            required: [true, "allFields"],
            enum: {
                values: bulgarianCitiesAndTowns,
                message: "town.invalid",
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
        }],
        isCompleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const Order = model("Order", orderSchema);
export default Order;