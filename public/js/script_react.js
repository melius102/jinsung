class Business extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.index == 1) {
            // log('componentDidMount business', this._reactInternalFiber.key);
            let event = new CustomEvent("businessMounted", {
                detail: { key: this._reactInternalFiber.key }
            });
            document.dispatchEvent(event);
        }
    }

    render() {
        let className = 'business menu-item';
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

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            time: 100
        };
        this.hClick = this.hClick.bind(this);
        this.hMouseEnter = this.hMouseEnter.bind(this);
        this.hMouseLeave = this.hMouseLeave.bind(this);
    }

    componentDidMount() {
        let event = new CustomEvent("productMounted", {
            detail: { index: this.props.index }
        });
        document.dispatchEvent(event);
    }

    hClick(evt) {
        // react synthetic event is reused for performance reason.
        if (this.state.hover == true) {
            alert(`hClick ${this.props.index}`);
        }
    }

    hMouseEnter(evt) {
        // log("hMouseEnter", this._reactInternalFiber.key);
        setTimeout(() => { this.setState({ hover: true }); }, this.state.time);
    }

    hMouseLeave(evt) {
        // log("hMouseLeave", this._reactInternalFiber.key);
        setTimeout(() => { this.setState({ hover: false }); }, this.state.time);
    }

    render() {
        return (
            <div className={"product"} onClick={this.hClick} onMouseEnter={this.hMouseEnter} onMouseLeave={this.hMouseLeave}>
                <img src={this.props.imgSrc} />
                <div>
                    <div className={"table"}>
                        <h2>{this.props.title}</h2>
                    </div>
                    <div className={"table"}>
                        <p>{this.props.desc}</p>
                    </div>
                </div>
            </div>
        );
    }
}

class ArrowBtn extends React.Component {
    constructor(props) {
        // log('constructor');
        super(props);
        this.state = {
            visible: { up: 'visible', dn: 'visible' }
        };

        this.clickUp = this.clickUp.bind(this);
        this.clickDn = this.clickDn.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        // log('getDerivedStateFromProps');
        let visible = { up: 'visible', dn: 'visible' };

        if (g_scrollTop <= g_menuList[0]) visible.up = 'hidden';
        else if (g_scrollTop >= g_menuList[g_menuList.length - 1]) visible.dn = 'hidden';

        if (state.visible.up !== visible.up || state.visible.dn !== visible.dn) {
            return { visible };
        } else {
            return null;
        }
    }

    findItemNum() {
        let upNum = g_menuList.filter((v, i) => {
            if (i == 0) {
                if (g_scrollTop <= g_menuList[i + 1]) return true;
            } else if (i == g_menuList.length - 1) {
                if (v < g_scrollTop) return true;
            } else {
                if (v < g_scrollTop && g_scrollTop <= g_menuList[i + 1]) return true;
            }
            return false;
        });

        let dnNum = g_menuList.filter((v, i) => {
            if (i == 0) {
                if (v > g_scrollTop) return true;
            } else if (i == g_menuList.length - 1) {
                if (g_scrollTop >= g_menuList[i - 1]) return true;
            } else {
                if (v > g_scrollTop && g_scrollTop >= g_menuList[i - 1]) return true;
            }
            return false;
        });
        // log('num', upNum[0], dnNum[0]);
        return { upTop: upNum[0], dnTop: dnNum[0] };
    }

    clickUp(evt) {
        // log('clickUp', g_scrollTop);
        // story.scrollIntoView();
        // $(document).scrollTop(this.findItemNum(this.state.scrlTop, g_menuList).upTop);
        if ($('html').is(':animated') == false) {
            let scrollTop = this.findItemNum();
            // log('scrollTop', scrollTop);
            $('html').stop().animate({ scrollTop: scrollTop.upTop }, 1500);
        }
    }

    clickDn(evt) {
        // log('clickDn', g_scrollTop);
        // $(document).scrollTop(this.findItemNum(this.state.scrlTop, g_menuList).dnTop);
        if ($('html').is(':animated') == false) {
            let scrollTop = this.findItemNum();
            // log('scrollTop', scrollTop);
            $('html').stop().animate({ scrollTop: scrollTop.dnTop }, 1500);
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

function reactComptLoad() {
    log('reactComptLoad');
    document.addEventListener("businessMounted", evt => {
        getMenuListPos();
        arrowBtnUpdate();
    });

    document.addEventListener("productMounted", evt => {
        if (evt.detail.index == 9) {
            finIntroAni();
        }
    });

    reactComptRender();
}

function reactComptRender() {
    let businesses = [];
    for (let i = 0; i < dscrp.length; i++) businesses.push(
        <Business key={i} index={dscrp.length - i} dscrp={dscrp[i]} imgSrc={imgSrc[i]} side={imgSide[i]} />
    );
    ReactDOM.render(<div>{businesses}</div>, $('#business-list')[0]);

    let contacts = [];
    for (let i = 0; i < contactTitle.length; i++) contacts.push(
        <Contact key={i} title={contactTitle[i]} content={contactContent[i]} />
    );
    ReactDOM.render(<div>{contacts}</div>, $('#contact-list')[0]);

    let products = [];
    let productImgSrc = "https://via.placeholder.com/400"
    let productTitle = "title";
    let productDesc = "product description";

    for (let i = 0; i < 5; i++) products.push(
        <Product key={i} index={i} imgSrc={productImgSrc} title={productTitle} desc={productDesc} />
    );
    ReactDOM.render(<div>{products}</div>, $('#product-list')[0]);
}

function arrowBtnUpdate() {
    ReactDOM.render(<ArrowBtn />, $('#down-arrow')[0]);
}

g_reactLoaded = true;
if (g_onLoad) {
    log('react loaded late.');
    reactComptLoad();
    addMap();
    setOpacity();
}