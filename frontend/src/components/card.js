import React from 'react';
import { Link } from 'react-router-dom';

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className="col-sm-6 col-md-4 p-3">
                <div className="card">
                    <img src={this.props.image} style={{ objectFit: 'cover', height: '25vh', width: '100%' }} alt="..." />
                    <div className="card-body">
                        {/* membaca data dari props yang dikirim oleh parent component */}
                        <h5 className="card-title">{this.props.title}</h5>
                        <p className="card-text">{this.props.description}</p>
                        <Link className="btn btn-primary" to={{
                            pathname: '/detail-album',
                            state: {
                                title: this.props.title,
                                description: this.props.description,
                                image: this.props.image
                            }
                        }}>View</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;