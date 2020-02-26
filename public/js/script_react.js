class Product extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let className = 'product';
        if (this.props.side == 'right') className += ` ${this.props.side}`;
        return (
            <div className={className}>
                <p>{this.props.dscrp}</p>
                <div className="img"><img src={this.props.imgSrc} /></div>
            </div>
        );
    }
}

class Contact extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>{this.props.title}</h2>
                <p>{this.props.content}</p>
            </div>
        );
    }
}

function hLoad2() {
    log('hLoad2');

    let products = [];
    for (let i = 0; i < dscrp.length; i++) products.push(
        <Product key={i} dscrp={dscrp[i]} imgSrc={imgSrc[i]} side={imgSide[i]} />
    );

    let contacts = [];
    for (let i = 0; i < dscrp.length; i++) contacts.push(
        <Contact key={i} title={contactTitle[i]} content={contactContent[i]} />
    );

    ReactDOM.render(<div>{products}</div>, $('#products')[0]);
    ReactDOM.render(<div>{contacts}</div>, $('#contactList')[0]);
}
