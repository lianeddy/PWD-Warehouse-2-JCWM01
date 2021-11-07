import React from 'react';
import "../assets/styles/loginRegister.css"
import Axios from 'axios'
import {API_URL} from '../constants/API'
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom'
import {getCurrentTransactionData} from '../redux/actions/transaction';


class History extends React.Component {
    state ={
      userTransaction: [],
      redirect: false,
      redirectNonUser: false,
    }

    componentDidMount(){
        if(this.props.userGlobal.auth_status==="user" || this.props.userGlobal.auth_status==="superadmin" || this.props.userGlobal.auth_status==="admin"){
          this.props.getCurrentTransactionData(this.props.userGlobal.user_id)
          console.log("authorized")
          this.fetchUserTransaction()
        }else{
          this.setState({redirectNonUser:true})
        }
      }

    fetchUserTransaction = () => {
        Axios.get(`${API_URL}/transaction/getAll?user_id=${this.props.userGlobal.user_id}`)
        .then((res)=> {
            this.setState({userTransaction:res.data})
        })
        .catch((err)=>{
            alert(err)
        })
      }

    renderTransaction = () => {
        console.log(this.state.userTransaction)
        if(this.state.userTransaction[0]){
          return this.state.userTransaction.map((val) => {
            return(
              <tr>    
                <td className="align-middle">{val.transactions_id}</td>
                <td className="align-middle">{this.props.userGlobal.username}</td>
                <td className="align-middle">Rp. {val.transaction_price}</td>
                <td className="align-middle">{val.transaction_status}</td> 
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
                          <th scope="col">Username</th>
                          <th scope="col">Total Price</th>
                          <th scope="col">Status</th>
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