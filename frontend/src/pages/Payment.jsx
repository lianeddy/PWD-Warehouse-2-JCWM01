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

  uploadHandler = () => {
     if (this.state.addFile) {
      let idTransaction = 0
        let formData = new FormData()
        this.state.transaction.map((val)=>{idTransaction = val.transactions_id})

        let obj = {
            user_id: this.props.userGlobal.user_id,
            transactions_id: idTransaction,
        }

        formData.append('data', JSON.stringify(obj));
        formData.append('file', this.state.addFile);
        Axios.post(`${API_URL}/upload/proof-upload`,formData)
            .then(res => {
                this.refreshPage()
                alert(res.data.message)
            })
            .catch(err => {
                console.log(err)
            });
    }
  }

  previewHandler = (e) => {
    if (e.target.files[0]) {
        this.setState({ addFileName: e.target.files[0].name, addFile: e.target.files[0] })
        //let preview = document.getElementById("imgpreview")
        //preview.src = URL.createObjectURL(e.target.files[0])
    }
  }

  payHandler = () => {
    let idTransaction = 0
    this.state.transaction.map((val)=>{idTransaction = val.transactions_id})
    Axios.post(`${API_URL}/transaction/pay`,{
      transactions_id: idTransaction
    })
    .then((res)=> {
        alert(`Your transaction number ${idTransaction} has been processed, please check your transaction history for updates`)
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
      return this.state.transaction.map((val) => {
        return(
          <tr>    
            <td className="align-middle">{val.transactions_id}</td>
            <td className="align-middle">{this.props.userGlobal.username}</td>
            <td className="align-middle">{val.transaction_status}</td>
            <td className="align-middle">
              <input type="file" className="form-control-dark" id="img" aria-describedby="emailHelp" onChange={this.previewHandler} />
            </td> 
            <td className="align-middle">
              <button className="btn-basic" onClick={this.uploadHandler}>Add Picture</button>
            </td>
            <td className="align-middle">
              <button className="btn-basic" onClick={this.payHandler}><p>Pay</p></button>
            </td>
          </tr>
    )}
  )} else { 
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
                      <th scope="col">Username</th>
                      <th scope="col">Status</th>
                      <th scope="col">Payment Proof</th>
                      <th scope="col">Upload Payment Proof</th>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Payment);