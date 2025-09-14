import { z } from "zod";

export const PersonRowSchema = z.tuple([z.string(),z.coerce.number()]).transform(tup => (
    {
        name: tup[0],
        age: tup[1]
    }
))
export type Person = z.infer<typeof PersonRowSchema>;

export const StudentSchema = z.tuple([z.string(),z.coerce.number(),z.string()]).transform(tup => (
    {
        name: tup[0],
        credits: tup[1],
        email: tup[2]
    }
))
export type Student = z.infer<typeof StudentSchema>;

export const ProductSchema = z.tuple([z.string(),z.string(),z.coerce.number(),z.coerce.boolean()]).transform(tup => (
    {
        product_name: tup[0],
        id: tup[1],
        price: tup[2],
        in_stock: tup[3]
    }
))
export type Product = z.infer<typeof ProductSchema>;