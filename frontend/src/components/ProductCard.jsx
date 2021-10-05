import React from 'react';
import '../assets/styles/product_card.css'
import {Link} from 'react-router-dom'
import Axios from 'axios'
import {API_URL} from '../constants/API'

class ProductCard extends React.Component{
    state = {
        productDetail:[],
        sizeList:[],
        pickSizeToggle: false,
        addToggle:false,
        productQty: 1,
        selected:1,
    }

    inputHandler = (event) => {
        const value = event.target.value;
        const name = event.target.name;
    
        //name dikasi kurung siku soalnya dia variabel
        this.setState({[name] : value})
    }

    fetchSize = (val) => {
        // console.log("fetched id",val.product_id)
        Axios.get(`${API_URL}/get-products-size?product_id=${val.product_id}`)
        .then((result) => {
          this.setState({productDetail: result.data})

          this.state.productDetail.map((val)=>{
            this.setState({sizeList: [...this.state.sizeList,val.size]})
          })
        })
        .catch((err)=>{
          alert(err)
      })
    }

    //yg dimasukin sizelist
    sizeRender = () => {
        console.log(this.state.sizeList)
        // this.state.sizeList.map((val)=> {
        //     return <p>{val}</p>
        // })
    }

    pickSizeToggle = () => {
        this.fetchSize(this.props.productData)
        this.setState({pickSizeToggle: true})
        this.setState({selected:this.props.productData.product_id})
        console.log(this.state.selected)
    }

    addToggle = () => {
        this.setState({addToggle: true})
        //kirim ke cart(update cart)
    }

    cancelToggle = () => {
        this.setState({pickSizeToggle: false})
        this.setState({addToggle: false})
        this.setState({sizeList:[]})
    }

    fnQuantityUp = () => {
        this.setState({productQty: this.state.productQty + 1})
    }
    
      fnQuantityDown = () => {
        this.setState({productQty: this.state.productQty - 1})
    }


    render(){
        return(
            <div className="d-flex justify-content-between mb-2">
                <div>
                <Link to={`/product/${this.props.productData.product_id}`} style={{textDecoration:"none",color:"inherit"}}>
                    <div className="product-card">

                        <img 
                            src={this.props.productData.product_image}
                            alt="" 
                        />

                    </div>
                </Link>
                    <div>
                        <div className="card-text">

                                <h4 >
                                    {this.props.productData.product_name}
                                </h4>

                            <p className="text-muted">Rp. {this.props.productData.price_sell.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}


export default ProductCard;