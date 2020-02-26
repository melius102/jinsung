window.addEventListener("load", () => {
    log('react');
    let products = [];
    for (let i = 0; i < dscrp.length; i++) products.push(
        <Product key={i} dscrp={dscrp[i]} imgSrc={imgSrc[i]} side={imgSide[i]} />
    );
    ReactDOM.render(<div>{products}</div>, $('#products')[0]);
});

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
