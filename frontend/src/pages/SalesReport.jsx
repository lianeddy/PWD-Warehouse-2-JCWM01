import React from 'react';
import "../assets/styles/salesReport.css"
import Axios from 'axios'
import {API_URL} from '../constants/API'
import { connect } from 'react-redux'
import {Link,Redirect} from 'react-router-dom'
import { Line } from 'react-chartjs-2';

const options = {
    scales: {
        y: {
        beginAtZero: true,
        }
    },
    outerWidth:50,
    outerHeight:50,
};

class SalesReport extends React.Component {
    state = {
        adminData:[],
        salesData:[],
        redirectNonUser:false,

        warehouseList:[],
        selectedWarehouse:0,

        topThree:[],

        transMonth : [],
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label:"Number of Transactions per Month in 2021",
                    data: [],
                    fill: false,
                    backgroundColor: 'rgba(255, 142, 44, 1)',
                    borderColor: 'rgba(255, 152, 63, 0.42)',
                },
            ],
        }
    }

    selectWarehouse = () => {
        if(this.state.adminData.auth_status==="admin"){
          
          this.setState({selectedWarehouse:this.state.adminData.warehouse_id})

        }
    }

    fetchWarehouseList = () => {
        Axios.get(`${API_URL}/admin/warehouse`)
        .then((result) => {
          this.setState({warehouseList:result.data})
        })
        .catch((err)=>{
          alert(err)
      })
    }
    
      renderWarehouse = () => {
        return this.state.warehouseList.map((val)=> {
          if(val.warehouse_name!=="superadmin"){
            return <option value={val.warehouse_id}>{val.warehouse_name}</option>
          }else{
            return <option value="0">All</option>
          }
        })
    }
    
      warehouseHandler = (event) => {
        const value = event.target.value;
    
        this.setState({selectedWarehouse : value}, this.fetchForSuperadmin)


      }

      fetchForSuperadmin = () => {
        this.fetchTopThree()
        this.fetchTimeList()
      }

    fetchAdminData = () => {
        Axios.get(`${API_URL}/admin/data?user_id=${this.props.userGlobal.user_id}`)
        .then((result) => {
            this.setState({adminData: result.data[0]})     
            this.selectWarehouse()  
            this.fetchsalesData() 
            this.fetchTopThree()
            this.fetchTimeList()
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

    fetchTopThree = () => {
        Axios.get(`${API_URL}/admin/top-three?warehouse_id=${this.state.selectedWarehouse}`)
        .then((result) => {
            this.setState({topThree: result.data})    
        })
        .catch((err)=>{
            alert(err)
        })
    }

    renderTopThree = () => {
        return this.state.topThree.map((val,key) =>{
            return(
                <tr>
                    <td>{key+1}</td>
                    <td>{val.product_name}</td>
                    <td><img src={API_URL + '/public' + val.product_image} className="admin-product-image" alt={val.product_name}/></td>
                    <td>{val.quantity}</td>
                </tr>
            )
        })
    }

    renderSalesReport = () => {
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

    fetchTimeList = () => {
        console.log(this.state.selectedWarehouse)
        this.setState({data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label:"Number of Transactions per Month in 2021",
                    data: [],
                    fill: false,
                    backgroundColor: 'rgba(255, 142, 44, 1)',
                    borderColor: 'rgba(255, 152, 63, 0.42)',
                },
            ],
        }})

        Axios.get(`${API_URL}/admin/time-transaction?warehouse_id=${this.state.selectedWarehouse}`)
        .then((result) => {
            let transactionTimeList = []
            result.data.map((val)=> {
                const month = val.time.slice(5,7)
                transactionTimeList.push({month})
            })
        
            //map into month vs transactions...
            let transMonth = [
                {month: "january", transactions: 0},
                {month: "february", transactions: 0},
                {month: "march", transactions: 0},
                {month: "april", transactions: 0},
                {month: "may", transactions: 0},
                {month: "june", transactions: 0},
                {month: "july", transactions: 0},
                {month: "august", transactions: 0},
                {month: "september", transactions: 0},
                {month: "october", transactions: 0},
                {month: "november", transactions: 0},
                {month: "december", transactions: 0},
            ]

            transactionTimeList.map((val)=>{
                switch(val.month){
                    case "01":
                        transMonth[0].transactions = transMonth[0].transactions + 1
                        break;
                    case "02":
                        transMonth[1].transactions = transMonth[1].transactions + 1
                        break;
                    case "03":
                        transMonth[2].transactions = transMonth[2].transactions + 1
                        break;
                    case "04":
                        transMonth[3].transactions = transMonth[3].transactions + 1
                        break;
                    case "05":
                        transMonth[4].transactions = transMonth[4].transactions + 1
                        break;
                    case "06":
                        transMonth[5].transactions = transMonth[5].transactions + 1
                        break;
                    case "07":
                        transMonth[6].transactions = transMonth[6].transactions + 1
                        break;
                    case "08":
                        transMonth[7].transactions = transMonth[7].transactions + 1
                        break;
                    case "09":
                        transMonth[8].transactions = transMonth[8].transactions + 1

                        break;
                    case "10":
                        transMonth[9].transactions = transMonth[9].transactions + 1
                        break;
                    case "11":
                        transMonth[10].transactions = transMonth[10].transactions + 1
                        break;
                    case "12":
                        transMonth[11].transactions = transMonth[11].transactions + 1
                        break;
                    default:
                        break;

                }
            })

            this.setState({transMonth: transMonth})  
            console.log(this.state.transMonth)

            //bikin array data, ambil dari transMonth transactions nya aja
            let data = this.state.data
            transMonth.map((val)=>{
                data.datasets[0].data.push(val.transactions)
            })

            console.log("data",data)
            this.setState({data:data})
        })
        .catch((err)=>{
            alert(err)
        })
    }

    componentDidMount = () => {
        if(this.props.userGlobal.auth_status==="admin"||this.props.userGlobal.auth_status==="superadmin"){
            this.fetchAdminData()
            this.fetchWarehouseList()

            }else{
            this.setState({redirectNonUser:true})
        }
    }

  render(){
    if(this.state.redirectNonUser){
        return <Redirect to="/" />
    }

    return(
        <div className="sales-page">
            <h2>Hello, {this.props.userGlobal.username}!</h2>
            {
                this.props.userGlobal.auth_status==="superadmin"?
                <>
                <h3>You are a <u><b>{this.props.userGlobal.auth_status}</b></u>. You can see sales report from all warehouses.</h3>
                <div className="mt-3 col-4 d-flex flex-row justify-content-start align-items-center">
                    <p className="me-2" >Please select a warehouse</p>
                    <select onChange={this.warehouseHandler} name="selectedWarehouse" className="form-control filter-style">
                    {this.renderWarehouse()}
                    </select>
                </div>
                </>
                :
                <h3>You are an {this.props.userGlobal.auth_status} of warehouse: <u><b>{this.state.adminData.warehouse_name}</b></u>. You can see sales report for this warehouse.</h3>
                
            }

            <div className="d-flex flex-row justify-content-around mx-2 mt-3">
                <div className="col-3">
                <h2>TOP 3 PRODUCTS</h2>
                    <table className="table">
                        <thead className="table-light">
                            <tr>
                                <th>No</th>
                                <th>Product Name</th>
                                <th>Product Image</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTopThree()}
                        </tbody>
                    </table>
                </div>
                <div className="col-6">
                <h2>TRANSACTIONS PER MONTH</h2>
                    {
                        this.state.data.datasets[0].data.length!==0?
                        <>
                            <Line data={this.state.data} options={options} />
                        </>
                        :
                        null
                    }
                </div>
            </div>
            <div className="col-12 mt-5">
                {
                    this.state.selectedWarehouse===0?
                    <h2>LIST OF <u><b>ALL</b></u> PRODUCTS SOLD</h2>
                    :
                    <h2>LIST OF PRODUCTS SOLD <u><b>IN THIS WAREHOUSE</b></u></h2>
                }

                <table className="table">
                    <thead className="table-light">
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Username</th>
                            <th>Warehouse Name</th>
                            <th>Product Name</th>
                            <th>Product Image</th>
                            <th>Size</th>
                            <th>Quantity</th>
                            <th>Buying Price</th>
                            <th>Selling Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderSalesReport()}
                    </tbody>
                </table>
            </div>
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