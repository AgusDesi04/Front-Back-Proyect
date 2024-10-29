import { Schema, model } from "mongoose";
import { nanoid } from "nanoid"

const ticketSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, default: ()=>nanoid()},
    amount: { type: Number, required: true },
    purcharse_datetime: {type: Date, default: Date.now, required: true},
    purchaser: { type: String, required: true }

  },)
 

export const ticketModel = model('tickets', ticketSchema)