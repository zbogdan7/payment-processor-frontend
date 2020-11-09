import React, { useReducer } from 'react';

import { Link } from 'react-router-dom';

import UserService from '../../services/user.service';
import AccountService from '../../services/account.service';
import PaymentService from '../../services/payment.service';

export default class MakePayment extends React.Component {
    constructor(props) {
        super(props);

        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onChangePayer = this.onChangePayer.bind(this);
        this.onChangePayee = this.onChangePayee.bind(this);
        this.onChangePayerAccount = this.onChangePayerAccount.bind(this);
        this.onChangePayeeAccount = this.onChangePayeeAccount.bind(this);
        this.makePayment = this.makePayment.bind(this);
        this.fetchAllPayerAccounts = this.fetchAllPayerAccounts.bind(this);
        this.fetchAllPayeeAccounts = this.fetchAllPayeeAccounts.bind(this);
        this.fetchAllUsers = this.fetchAllUsers.bind(this);

        this.state = {
            id: null,
            amount: 0,
            payer: null,
            payee: null,
            payerAccount: null,
            payeeAccount: null,
            submitted: false,
            allUsers: [],
            allPayerAccounts: [],
            allPayeeAccounts: []
        };
    }

    componentDidMount() {
        this.fetchAllUsers();
    }

    fetchAllUsers() {
        UserService.all()
            .then(response => {
                this.setState({
                    allUsers: response.data
                })
                console.log(this.state)
            })
            .catch(e => console.log(e));
    }

    fetchAllPayerAccounts(id) {
        AccountService.findByOwner(id)
            .then(response => {
                this.setState({
                    allPayerAccounts: response.data
                })
            })
            .catch(e => console.log(e))
    }

    fetchAllPayeeAccounts(id) {
        AccountService.findByOwner(id)
            .then(response => {
                this.setState({
                    allPayeeAccounts: response.data
                })
            })
            .catch(e => console.log(e))
    }

    onChangeAmount(e) {
        this.setState({
            amount: e.target.value
        })
    }

    onChangePayer(e) {
        const payerId = e.target.value;

        UserService.find(payerId)
            .then(response => {
                this.setState({
                    payer: response.data
                }, () => {
                    this.fetchAllPayerAccounts(this.state.payer.id)
                });
            })
            .catch(err => console.log(err))
    }

    onChangePayee(e) {
        const payeeId = e.target.value

        UserService.find(payeeId)
            .then(response => {
                this.setState({
                    payee: response.data
                }, () => {
                    this.fetchAllPayeeAccounts(this.state.payee.id)
                })
            })
            .catch()
    }

    onChangePayerAccount(e) {
        const payerAccountId = e.target.value

        AccountService.find(payerAccountId)
            .then(response => {
                this.setState({
                    payerAccount: response.data
                })
            })
            .catch(err => console.log(err))
    }

    onChangePayeeAccount(e) {
        const payeeAccountId = e.target.value

        AccountService.find(payeeAccountId)
            .then(response => {
                this.setState({
                    payeeAccount: response.data
                })
            })
            .catch(err => console.log(err))
    }

    makePayment() {
        let data = {
            amount: this.state.amount,
            payer: this.state.payer,
            payee: this.state.payee,
            payerAccount: this.state.payerAccount,
            payeeAccount: this.state.payeeAccount
        };
        PaymentService.create(data)
            .then(response => {
                console.log(response);
                this.setState({
                    submitted: true
                });
                window.alert("Payment has been processed and successfully stored.");
            })
            .catch(err => console.log(data))
    }

    render() {
        return (
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4 text-center">
                        <h3>Making a Payment</h3>
                        {this.state.submitted ? (
                            <div>
                                <h4>You have successfully sent your Payment!</h4>
                                <Link to={"/payments"} className="btn btn-outline-success">See all Payment</Link>
                            </div>
                        ) : (
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="payer">From Payer: </label>
                                        <select name="payer" id="payer" className="form-control" onChange={this.onChangePayer}>
                                            {this.state.allUsers.map((user, index) => (
                                                <option key={index} value={user.id}>{`${user.firstname} ${user.lastname}`}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="amount">Amount: </label>
                                        <input type="number" min="1" max="999999" className="form-control" value={this.state.amount} onChange={this.onChangeAmount} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="payerAccount">From Payer Account: </label>
                                        <select className="form-control" name="payerAccount" id="payerAccount" onChange={this.onChangePayerAccount}>
                                            {this.state.allPayerAccounts.length
                                                ? (this.state.allPayerAccounts.map((payer, index) => (
                                                    <option key={index} value={payer.id}>Acc #{payer.id}</option>
                                                )))
                                                : (
                                                    <option value={null}>Select another payer</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="payee">To Payee: </label>
                                        <select className="form-control" name="payee" id="payee" onChange={this.onChangePayee}>
                                            {this.state.allUsers.map((user, index) => (
                                                <option key={index} value={user.id}>{`${user.firstname} ${user.lastname}`}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="payeeAccount">To Payee Account: </label>
                                        <select name="payee" id="payee" className="form-control" onChange={this.onChangePayeeAccount}>
                                            {this.state.allPayeeAccounts.length ? (
                                                this.state.allPayeeAccounts.map((payee, index) => (
                                                    <option key={index} value={payee.id}>Acc #{payee.id}</option>
                                                ))
                                            ) : (
                                                    <option value={null}>Select another payee</option>
                                                )}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-success" type="submit" onClick={this.makePayment}>
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-globe" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4H2.255a7.025 7.025 0 0 1 3.072-2.472 6.7 6.7 0 0 0-.597.933c-.247.464-.462.98-.64 1.539zm-.582 3.5h-2.49c.062-.89.291-1.733.656-2.5H3.82a13.652 13.652 0 0 0-.312 2.5zM4.847 5H7.5v2.5H4.51A12.5 12.5 0 0 1 4.846 5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5H7.5V11H4.847a12.5 12.5 0 0 1-.338-2.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12H7.5v2.923c-.67-.204-1.335-.82-1.887-1.855A7.97 7.97 0 0 1 5.145 12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11H1.674a6.958 6.958 0 0 1-.656-2.5h2.49c.03.877.138 1.718.312 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12h2.355a7.967 7.967 0 0 1-.468 1.068c-.552 1.035-1.218 1.65-1.887 1.855V12zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5h-2.49A13.65 13.65 0 0 0 12.18 5h2.146c.365.767.594 1.61.656 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z" />
                                            </svg>{" Pay"}
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>
                    <div className="col-md-4"></div>
                </div>
            </div>
        );
    }
}