import React from 'react';
import "../assets/styles/landingPage.css"
import Axios from 'axios'
import {API_URL} from '../constants/API'

class Payment extends React.Component {
  payHandler = () => {
    Axios.post(`${API_URL}/transaction/pay`,{
      transactions_id: this.props.location.state.transactions_id
    })
    .then((res)=> {
        alert(`Yout transaction number ${this.props.location.state.transactions_id} has been paid successfully`)
    })
    .catch((err)=>{
        alert(err)
    })
  }

  render(){
    return(
        <div className="payment-container">
            <h1>Payment Page</h1>
            <button className="btn-basic" onClick={this.payHandler}><p>Pay</p></button>
        </div>
     
    )
  }
}


export default Payment;