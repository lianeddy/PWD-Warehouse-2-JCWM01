import React from 'react';
import "../assets/styles/loginRegister.css"
import Axios from 'axios'
import {API_URL} from '../constants/API'
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom'
import {getCurrentTransactionData} from '../redux/actions/transaction';


class History extends React.Component {
    state ={
      pendingTransaction: [],
      redirect: false,
      redirectNonUser: false,
    }

    refreshPage = ()=>{
        window.location.reload();
      }

    componentDidMount(){
        if(this.props.userGlobal.auth_status==="admin" || this.props.userGlobal.auth_status==="superadmin"){
          this.props.getCurrentTransactionData(this.props.userGlobal.user_id)
          console.log("authorized")
          this.fetchAdminTransaction()
        }else{
          this.setState({redirectNonUser:true})
        }
      }

      confirmHandler = (val) => {
        Axios.post(`${API_URL}/transaction/confirm`,{
          transactions_id: val
        })
        .then((res)=> {
            alert(`The transaction number ${val} has been confirmed`)
            this.refreshPage()
        })
        .catch((err)=>{
            alert(err)
        })
      }

      rejectHandler = (val) => {
        Axios.post(`${API_URL}/transaction/reject`,{
          transactions_id: val
        })
        .then((res)=> {
            alert(`The transaction number ${val} has been rejected`)
            this.refreshPage()
        })
        .catch((err)=>{
            alert(err)
        })
      }

    fetchAdminTransaction = () => {
        Axios.get(`${API_URL}/transaction/getAdmin?user_id=${this.props.userGlobal.user_id}`)
        .then((res)=> {
            this.setState({pendingTransaction:res.data})
        })
        .catch((err)=>{
            alert(err)
        })
      }

    renderTransaction = () => {
        console.log(this.state.pendingTransaction)
        if(this.state.pendingTransaction[0]){
          return this.state.pendingTransaction.map((val) => {
            return(
              <tr>    
                <td className="align-middle">{val.transactions_id}</td>
                <td className="align-middle">{val.time.slice(0,10)}</td>
                <td className="align-middle">Rp. {val.transaction_price}</td>
                <td className="align-middle">{val.transaction_status}</td>
                <td className="align-middle">
                    <button className="btn-basic" onClick={()=>{this.confirmHandler(val.transactions_id)}}><p>Confirm</p></button>
                </td> 
                <td className="align-middle">
                    <button className="btn-basic" onClick={()=>{this.rejectHandler(val.transactions_id)}}><p>Reject</p></button>
                </td> 
              </tr>
        )}
      )} else { 
        console.log (`err`)
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
                          <th scope="col">Date</th>
                          <th scope="col">Total Price</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                          <th scope="col">Action</th>
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
    
    export default connect(mapStateToProps, mapDispatchToProps)(History);