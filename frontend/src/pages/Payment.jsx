import React from 'react';
import "../assets/styles/transaction.css"
import Axios from 'axios'
import {API_URL} from '../constants/API'
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom'
import {getCurrentTransactionData} from '../redux/actions/transaction';

class Payment extends React.Component {
  state ={
    transaction: [],
    redirect: false,
    redirectNonUser: false,
  }

  refreshPage = ()=>{
    window.location.reload();
  }

  componentDidMount(){
    if(this.props.userGlobal.auth_status==="user" || this.props.userGlobal.auth_status==="superadmin" || this.props.userGlobal.auth_status==="admin"){
      this.props.getCurrentTransactionData(this.props.userGlobal.user_id)
      console.log("authorized")
      this.fetchCurrentTransaction()
    }else{
      this.setState({redirectNonUser:true})
    }
  }

  payHandler = () => {
    let idTransaction = 0
    this.state.transaction.map((val)=>{idTransaction = val.transactions_id})
    Axios.post(`${API_URL}/transaction/pay`,{
      transactions_id: idTransaction
    })
    .then((res)=> {
        alert(`Your transaction number ${idTransaction} has been paid successfully`)
        this.refreshPage()
    })
    .catch((err)=>{
        alert(err)
    })
  }

  fetchCurrentTransaction = () => {
    Axios.get(`${API_URL}/transaction/get?user_id=${this.props.userGlobal.user_id}`)
    .then((res)=> {
        this.setState({transaction:res.data})
    })
    .catch((err)=>{
        alert(err)
    })
  }

  renderTransaction = () => {
    if(this.state.transaction[0]){
    return this.state.transaction.map((val) =>{
    return(
    <tr>    
    <td className="align-middle">{val.transactions_id}</td>
    <td className="align-middle">{this.props.userGlobal.username}</td>
    <td className="align-middle">Waiting Payment</td>
    <td className="align-middle">
      <button className="btn-basic" onClick={this.payHandler}><p>Pay</p></button>
    </td> 
  </tr>
    )}
  ) 
  } else { 
    console.log ("no transaction require payment")
  }
}

  
  render(){
    const { redirectNonUser } = this.state;
    if(redirectNonUser) {
        return <Redirect to="/"/>
    }
    console.log()
      return (
        <div className="p-5 cart-container">
        <div className="col-9 text-center">
          <table className="table">
            <thead className="table-light">
                  <tr>
                    <th scope="col">Transaction no.</th>
                    <th scope="col">Buyer id</th>
                    <th scope="col">Status</th>
                    <th scope="col">Total Price</th>
                  </tr>
            </thead>
            <tbody>
              {this.renderTransaction()}
            </tbody>
          </table>
        </div>
        </div>
      )}
    }



const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
    transactionGlobal: state.transaction
  }
}

const mapDispatchToProps = {
  getCurrentTransactionData,
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Payment);