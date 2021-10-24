import React from 'react';
import "../assets/styles/salesReport.css"
import Axios from 'axios'
import {API_URL} from '../constants/API'
import { connect } from 'react-redux'

class SalesReport extends React.Component {
    state = {
        adminData:[],
        salesData:[],
    }

    fetchAdminData = () => {
        Axios.get(`${API_URL}/admin/data?user_id=${this.props.userGlobal.user_id}`)
        .then((result) => {
            this.setState({adminData: result.data[0]})       
            this.fetchsalesData() 
        })
        .catch((err)=>{
            alert(err)
        })
    }

    fetchsalesData = () => {
        Axios.get(`${API_URL}/admin/sales?warehouse_id=${this.state.adminData.warehouse_id}`)
        .then((result) => {
            this.setState({salesData: result.data})    
        })
        .catch((err)=>{
            alert(err)
        })
    }

    renderSalesReport = () => {
        console.log(this.state.salesData)
        return this.state.salesData.map((val) =>{
            return(
                <tr>
                    <td>{val.time.slice(0,10)}</td>
                    <td>{val.time.slice(11,19)}</td>
                    <td>{val.username}</td>
                    <td>{val.warehouse_name}</td>
                    <td>{val.product_name}</td>
                    <td><img src={API_URL + '/public' + val.product_image} className="admin-product-image" alt={val.product_name}/></td>
                    <td>{val.size.toUpperCase()}</td>
                    <td>{val.quantity}</td>
                    <td>Rp. {val.price_buy.toLocaleString()}</td>
                    <td>Rp. {val.transaction_price.toLocaleString()}</td>
                </tr>
            )
        })
    }

    componentDidMount = () => {
        this.fetchAdminData()
      }

  render(){
    return(
        <div className="sales-page">
            <h2>Hello, {this.props.userGlobal.username}!</h2>
            {
                this.props.userGlobal.auth_status==="superadmin"?
                <>
                <h3>You are a <u><b>{this.props.userGlobal.auth_status}</b></u>. You can see sales report from all warehouses.</h3>
                </>
                :
                <h3>You are an {this.props.userGlobal.auth_status} of warehouse: <u><b>{this.state.adminData.warehouse_name}</b></u>. You can see sales report for this warehouse.</h3>
                
            }

        </div>
     
    )
  }
}


const mapStateToProps =(state)=> {
    return{
      userGlobal: state.user,
    }
};
  
export default connect(mapStateToProps)(SalesReport);