
import cartManagerMongoose from "../daos/cartsManagerMongoose.js";
import productManagerMongoose from "../daos/productManagerMongoose.js";

class CartController
{
    constructor(){
        this.cartService=  new cartManagerMongoose()
        this.productService=  new productManagerMongoose()
    }

    createCart = async(req, res) => {
    try
    {
        this.cartService.createCart()
        return res.status(200).send({ status: 'success', payload:('El carrito fue creado corectamente') })
    }catch (error){
        return res.status(500).send('Error 500 en el server')
        console.log (error)
    }}
    
    getCart = async (req, res)=>{
        try
        {
        const { cid } = req.params
        console.log (cid)
        const carrito= await (this.cartService.getCartsById(cid));
        if (!carrito)
        {
            return res.status(404).send(`No existe el carrito con ID ${cid} `);
        }
        return res.status(200).send({ status: 'success', payload: carrito })
    }catch (error){
       return res.status(500).send('Error 500 en el server')
       console.log (error)
    }
    }

    addCart = async(req, res) => {
        try
        {
              const { cid , pid } = req.params
              let { quantity } = req.body
                
              const carrito= await (this.cartService.getCartsById(cid));
               if (!carrito)
               {
                   return res.status(404).send(`No existe el carrito con ID ${cid} `);
               }
               console.log ('PID Product', pid)
               const producto = await this.productService.getProductById( pid)
               console.log (producto)
               if (!producto)
               {
                   return res.status(404).send(`No existe el producto con ID ${pid}`);
               }
   
               if (typeof quantity === "undefined") {
                   quantity = 1;
                   console.log('cantidad', quantity);
                }
              const result= await (this.cartService.addCarts(cid,pid, quantity));
              return res.status(200).send({ status: 'success', payload:(`El producto ID ${pid} fue agregado al carrito Id ${cid}`) })
        }catch (error){
           return res.status(500).send('Error 500 en el server')
           console.log (error)
        }
    }
    
    deleteCartProduct = async(req, res) => {
    try
    {
        const { cid , pid } = req.params
        const carrito= await (this.cartService.getCartsById(cid));
        if (!carrito)
        {
            return res.status(404).send(`No existe el carrito con ID ${cid} `);
        }
        const result= await this.cartService.deleteProcuct(cid, pid)
        return res.status(200).send({ status: 'success', payload:(`El producto ID ${pid} fue eliminado del carrito Id ${cid}`) })
    }catch (error){
       return res.status(500).send('Error 500 en el server')
       console.log (error)
    }
    }
    
    deleteCart =  async(req, res) => {
    try
    {
        const { cid } = req.params
        const carrito= await (this.cartService.getCartsById(cid));
        if (!carrito)
        {
            return res.status(404).send(`No existe el carrito con ID ${cid} `);
        }
        const result= await this.cartService.deleteAllProcuct(cid)
        return res.status(200).send({ status: 'success', payload:(`Se vacio todo el carrito Id ${cid}`) })
    }catch (error){
        return res.status(500).send('Error 500 en el server')
        console.log (error)
    }
    }

    updateCartProduct = async (req, res)=>{
        const {cid , pid} = req.params;
        const carrito= await (this.cartService.getCartsById(cid));
        if (!carrito)
        {
            return res.status(404).send(`No existe el carrito con ID ${cid} `);
        }
        const result= await (this.cartService.addCarts(cid,pid,req.body.quantity));
        return res.status(200).send({ status: 'success', payload:(`Se actualizo la cantidad del producto en el carrito Id ${cid}`) })
    }

    addManyCartProducts = async (req, res)=>{

        const {cid} = req.params;
    
        const carrito= await (this.cartService.getCartsById(cid));
        if (!carrito)
        {
            return res.status(404).send(`No existe el carrito con ID ${cid} `);
        }
    
        carrito.products = req.body;
        const result= await this.cartService.addAllProcuct(cid, carrito)
        return res.status(200).send({ status: 'success', payload:(`Se agregaron todos los productos al carrito Id ${cid}`) })
    }

}

export default CartController