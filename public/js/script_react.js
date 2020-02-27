class Product extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.index == 1) {
            // log('componentDidMount product', this._reactInternalFiber.key);
            let event = new CustomEvent("productMounted", {
                detail: { key: this._reactInternalFiber.key }
            });
            document.dispatchEvent(event);
        }
    }

    render() {
        let className = 'product menu-item';
        if (this.props.side == 'right') className += ` ${this.props.side}`;
        return (
            <div className={className}>
                <div className="img"><img src={this.props.imgSrc} /></div>
                <p>{this.props.dscrp}</p>
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

class ArrowBtn extends React.Component {
    constructor(props) {
        // log('constructor');
        super(props);
        this.state = {
            scrlTop: this.props.scrlTop,
            visible: { up: 'visible', dn: 'visible' }
        };

        this.clickUp = this.clickUp.bind(this);
        this.clickDn = this.clickDn.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        // log('getDerivedStateFromProps');
        let scrlTop = props.scrlTop;
        let visible = { up: 'visible', dn: 'visible' };

        if (scrlTop <= g_menuList[0]) visible.up = 'hidden';
        else if (scrlTop >= g_menuList[g_menuList.length - 1]) visible.dn = 'hidden';

        return { scrlTop, visible };
    }

    findItemNum(scrlTop) {
        let upNum = g_menuList.filter((v, i) => {
            if (i == 0) {
                if (scrlTop <= g_menuList[i + 1]) return true;
            } else if (i == g_menuList.length - 1) {
                if (v < scrlTop) return true;
            } else {
                if (v < scrlTop && scrlTop <= g_menuList[i + 1]) return true;
            }
            return false;
        });

        let dnNum = g_menuList.filter((v, i) => {
            if (i == 0) {
                if (v > scrlTop) return true;
            } else if (i == g_menuList.length - 1) {
                if (scrlTop >= g_menuList[i - 1]) return true;
            } else {
                if (v > scrlTop && scrlTop >= g_menuList[i - 1]) return true;
            }
            return false;
        });
        // log('num', upNum[0], dnNum[0]);
        return { upTop: upNum[0], dnTop: dnNum[0] };
    }

    clickUp(evt) {
        // console.log('clickUp', this.state.scrlTop);
        // story.scrollIntoView();
        // $(document).scrollTop(this.findItemNum(this.state.scrlTop, g_menuList).upTop);
        if ($('html').is(':animated') == false) {
            $('html').stop().animate({ scrollTop: this.findItemNum(this.state.scrlTop).upTop }, 1500);
        }
    }

    clickDn(evt) {
        // console.log('clickDn', this.state.scrlTop);
        // $(document).scrollTop(this.findItemNum(this.state.scrlTop, g_menuList).dnTop);
        if ($('html').is(':animated') == false) {
            $('html').stop().animate({ scrollTop: this.findItemNum(this.state.scrlTop).dnTop }, 1500);
        }
    }

    render() {
        return (
            <div>
                <i style={{ visibility: this.state.visible.up }} onClick={this.clickUp} className="fas fa-chevron-up"></i>
                <i style={{ visibility: this.state.visible.dn }} onClick={this.clickDn} className="fas fa-chevron-down"></i>
            </div>
        );
    }
}

function hLoad2() {
    log('hLoad2');
    document.addEventListener("productMounted", evt => {
        arrowBtnUpdate();
    });
    reactComptLoad();
}

function reactComptLoad() {
    let products = [];
    for (let i = 0; i < dscrp.length; i++) {
        products.push(<Product key={i} index={dscrp.length - i} dscrp={dscrp[i]} imgSrc={imgSrc[i]} side={imgSide[i]} />);
    }
    ReactDOM.render(<div>{products}</div>, $('#product-list')[0]);

    let contacts = [];
    for (let i = 0; i < dscrp.length; i++) contacts.push(
        <Contact key={i} title={contactTitle[i]} content={contactContent[i]} />
    );
    ReactDOM.render(<div>{contacts}</div>, $('#contact-list')[0]);
}

let g_menuList = [];
function arrowBtnUpdate() {
    // log('arrowBtnUpdate');
    $('.menu-item').each(function (i) {
        g_menuList.push($(this).offset().top);
    });

    ReactDOM.render(<ArrowBtn scrlTop={$(document).scrollTop()} />, $('#down-arrow')[0]);
}