// https://firebase.google.com/docs/auth
// https://firebase.google.com/docs/auth/web/manage-users
// https://github.com/firebase/quickstart-js/blob/master/auth/email-password.html#L82-L109
function loadFBSDK() {
    log('loadFBSDK');

    // event handler
    $('#goto-main').click(hGotoMain);
    $('#sign-in a').click(hSignIn);
    $('#sign-up a').click(hSignUp);
    $('#sign-out a').click(hSignOutFB);
    $('#del-account a').click(hDelAccountFB);

    ReactDOM.render(<LoginFormFB type="create" />, $('#sign-form')[0]);
    initFirebase();
}

function hGotoMain() {
    wrapChange(g_subColor2, () => {
        $('#wrap1').hide();
        $('#sign-form').hide();
        $('#wrap0').show();
        hResize();
        story.scrollIntoView();
    });
}

function hSignIn() {
    ReactDOM.render(<LoginFormFB type="sing-in-form" />, $('#sign-form')[0]);
}

function hSignUp() {
    ReactDOM.render(<LoginFormFB type="sing-up-form" />, $('#sign-form')[0]);
}

function clearInput() {
    $('#username').val("");
    $('#email').val("");
    $('#password').val("");
}

class LoginFormFB extends React.Component {
    hCancel() { $('#sign-form').hide(); }

    render() {
        clearInput();
        if (this.props.type == 'sing-in-form') username.value = "";
        return (
            <div className={this.props.type}>
                <input type="text" id="username" name="username" placeholder="아이디" />
                <input type="text" id="email" name="email" placeholder="이메일" />
                <input type="password" id="password" name="password" placeholder="비밀번호" />
                <div className="btns">
                    <button id="fb-sign-in" name="signin">로그인</button>
                    <button id="fb-sign-up" name="signup">회원가입</button>
                    <button id="cancel" onClick={this.hCancel}>취소</button>
                </div>
                {/* <button disabled id="fb-verify-email" name="verify-email">인증메일 보내기</button> */}
                <a id="fb-password-reset" href="#" name="verify-email">비밀번호 변경하기</a>
            </div>
        );
    }

    // componentDidMount() { }

    componentDidUpdate(prevProps, prevState, snapshot) {
        $('#sign-form').show();
    }
}

let strInfo = {
    resendVerificationEmail: '이메일 주소가 아직 인증되지 않았습니다. 인증메일을 다시 발송하시겠습니까?',
    deleteAccount: '회원탈퇴를 하시겠습니까?'
}

let errDelAccount = {
    "auth/requires-recent-login": "재 로그인 후, 다시 진행해 주십시요."
};

function hDelAccountFB() {
    if (firebase.auth().currentUser && confirm(strInfo['deleteAccount'])) {
        let user = firebase.auth().currentUser;
        user.delete().then(function () {
            alert("탈퇴가 정상적으로 처리되었습니다.");
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errDelAccount.hasOwnProperty(errorCode)) alert(errDelAccount[errorCode]);
            else alert(errorMessage);
            console.log(error);
        });
    }
}

function hSignOutFB() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
        // document.getElementById('fb-sign-in').disabled = true;
    }
}

let errSignUp = {
    'auth/weak-password': '비밀번호가 너무 짧습니다.',
    'auth/invalid-email': '이메일 주소 형식이 올바르지 않습니다.'
};

function hSignUpFB() {
    if (!firebase.auth().currentUser) { // for signup

        var username = document.getElementById('username').value;
        if (username < 4) {
            alert('사용자 이름을 입력하세요.');
            return;
        }

        var email = document.getElementById('email').value;
        if (email.length < 4) {
            alert('이메일 주소를 입력하세요.');
            return;
        }

        var password = document.getElementById('password').value;
        if (password.length < 4) {
            alert('비밀번호를 입력하세요.');
            return;
        }

        // Sign in with email and pass.
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            $('#sign-form').hide();
            sendEmailVerification();
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errSignUp.hasOwnProperty(errorCode)) alert(errSignUp[errorCode]);
            else alert(errorMessage);
            console.log(error);
            document.getElementById('fb-sign-up').disabled = false;
        });
        document.getElementById('fb-sign-up').disabled = true;
    }
}

let errSignIn = {
    'auth/wrong-password': '이메일 또는 비밀번호가 틀렸습니다.', // '비밀번호가 틀렸습니다.',
    'auth/user-not-found': '이메일 또는 비밀번호가 틀렸습니다.', // '가입된 이메일이 아닙니다.',
    'auth/invalid-email': '이메일 주소 형식이 올바르지 않습니다.'
};

function hSignInFB() {
    if (!firebase.auth().currentUser) { // for signin

        var email = document.getElementById('email').value;
        if (email.length < 4) {
            alert('이메일 주소를 입력하세요.');
            return;
        }

        var password = document.getElementById('password').value;
        if (password.length < 4) {
            alert('비밀번호를 입력하세요.');
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            $('#sign-form').hide();
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errSignIn.hasOwnProperty(errorCode)) alert(errSignIn[errorCode]);
            else alert(errorMessage);
            console.log(error);
            document.getElementById('fb-sign-in').disabled = false;
        });
        document.getElementById('fb-sign-in').disabled = true;
    }
}

function sendEmailVerification() {
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        alert('인증메일이 발송되었습니다.');
    });
}

let errPasswordReset = {
    'auth/invalid-email': '이메일 주소 형식이 올바르지 않습니다.'
};

function sendPasswordReset() {
    var email = document.getElementById('email').value;
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        alert('비밀번호 재설정 메일이 발송되었습니다.');
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errPasswordReset.hasOwnProperty(errorCode)) alert(errPasswordReset[errorCode]);
        else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
    });
}

function initFirebase() {
    authenFB();
    loadProductInfoFB();
    // functionsFB();
    // realtimeDBFB();
}

function authenFB() {
    // listener for auth state changes.
    firebase.auth().onAuthStateChanged(async function (user) {
        log('onAuthStateChanged');
        if (user) { // signed in
            log('signed in user', user);
            // let isAnonymous = user.isAnonymous; // ???
            // let providerData = user.providerData; // ???
            if (username.value) { // signed up
                // sendEmailVerification();
                try {
                    await user.updateProfile({ displayName: username.value });
                    if (user.displayName) $('#login-username u b').text(user.displayName);
                } catch (err) {
                    $('#login-username u b').text(user.email);
                    log(err);
                }
            } else { // signed in
                if (user.displayName) $('#login-username u b').text(user.displayName);
                else $('#login-username u b').text(user.email);
                if (!user.emailVerified && confirm(strInfo['resendVerificationEmail'])) {
                    sendEmailVerification();
                };
            }
            $('#menu1').addClass('logged-in-menu');
            document.getElementById('fb-sign-in').disabled = true;
            document.getElementById('fb-sign-up').disabled = true;
            // if (!user.emailVerified) document.getElementById('fb-verify-email').disabled = false;
        } else { // signed out
            $('#menu1').removeClass('logged-in-menu');
            $('#login-username u b').text('');
            document.getElementById('fb-sign-in').disabled = false;
            document.getElementById('fb-sign-up').disabled = false;
        }
        // document.getElementById('fb-verify-email').disabled = true;
    });
    // click event listener
    document.getElementById('fb-sign-in').addEventListener('click', hSignInFB, false);
    document.getElementById('fb-sign-up').addEventListener('click', hSignUpFB, false);
    // document.getElementById('fb-verify-email').addEventListener('click', sendEmailVerification, false);
    document.getElementById('fb-password-reset').addEventListener('click', sendPasswordReset, false);
}

let g_pInfos;
async function loadProductInfoFB() {
    let pInfos = [];
    const database = firebase.database();
    const storageRef = firebase.storage().ref();
    let productsRef = storageRef.child('products');
    log("start");

    try {
        // realtimeDB
        let snapshot = await database.ref('products').once('value');
        let productsVal = snapshot.val();
        let productsKey = Object.keys(productsVal);
        log("complete realtimeDB");

        // storage
        if (rdev) {
            for (let i = 0; i < productsKey.length; i++) {
                let productInfo = {};
                productInfo.imgUrl = "https://via.placeholder.com/400";
                productInfo.title = productsVal[productsKey[i]].title;
                productInfo.description = productsVal[productsKey[i]].description;
                productInfo.options = productsVal[productsKey[i]].options;
                pInfos.push(productInfo);
            }
        } else {
            let res = await productsRef.listAll();
            for (let i = 0; i < res.items.length; i++) {
                let productInfo = {};
                productInfo.imgUrl = await res.items[i].getDownloadURL();
                productInfo.title = productsVal[productsKey[i]].title;
                productInfo.description = productsVal[productsKey[i]].description;
                productInfo.options = productsVal[productsKey[i]].options;
                pInfos.push(productInfo);
            }
        }
        log("complete storage");

    } catch (err) { log(err); }
    g_pInfos = pInfos;

    showProductList();
}

function showProductList() {
    let products = [];
    for (let i = 0; i < g_pInfos.length; i++) products.push(
        <Product key={i} index={i} imgSrc={g_pInfos[i].imgUrl} title={g_pInfos[i].title} desc={g_pInfos[i].description} />
    );
    ReactDOM.render(<div id="pdt-list">{products}</div>, $('#product-contents')[0]);
}

function showProductDetail(index) {
    ReactDOM.render(<ProductDetail productInfo={g_pInfos[index]} />, $('#product-contents')[0]);
}

// ProductDetail
class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        let optionsObj = {}
        let options = this.props.productInfo.options;
        Object.keys(options).forEach(v => {
            optionsObj[v] = { flag: false, number: 0 };
        });
        this.state = {
            totalPrice: 0,
            options: optionsObj
        };
        this.hSelectChange = this.hSelectChange.bind(this);
        this.hSDetailChange = this.hSDetailChange.bind(this);
    }

    hAddtoCart() {
    }

    hBuy() {
    }

    hCancel() {
        wrapChange(g_subColor2, () => {
            showProductList();
            $(document).scrollTop(0);
        });
    }

    hSelectChange(evt) {
        if (!evt.target.value) return;
        let selectedOption = evt.target.value;
        let state = JSON.parse(JSON.stringify(this.state));
        state.options[selectedOption].flag = true;
        this.setState(state);
    }

    hSDetailChange(opt, value) {
        let state = JSON.parse(JSON.stringify(this.state));
        state.options[opt].number = value;
        this.UpdateTotalPrice(state, this.props.productInfo.options);
        this.setState(state);
    }

    hSDetailClick(opt, i) {
        let state = JSON.parse(JSON.stringify(this.state));
        state.options[opt].number = 0;
        state.options[opt].flag = false;
        this.UpdateTotalPrice(state, this.props.productInfo.options);
        this.setState(state);
    }

    UpdateTotalPrice(state, options) {
        log('UpdateTotalPrice');
        let totalPrice = 0;
        let optionsKeyArr = Object.keys(options);
        optionsKeyArr.forEach(opt => {
            totalPrice += options[opt].price * state.options[opt].number;
        });
        state.totalPrice = totalPrice;
        // return state;
    }

    render() {
        log('state', this.state.options);

        // props.productInfo.options
        let options = this.props.productInfo.options;
        // log(this.props.productInfo);
        // log(Object.keys(options));
        let optionsArr = Object.keys(options).map(v => {
            options[v].key = v;
            return options[v];
        });
        let optionTags = [];
        optionTags.push(<option key={0} value={""}>선택</option>);
        optionsArr.forEach((v, i) => {
            optionTags.push(<option key={i + 1} value={v.key}>{v.name}</option>);
        });

        // state.options
        let selectedOptionsArr = Object.keys(options).filter(v => {
            return this.state.options[v].flag == true;
        });
        let selectedDetailCmp = [];
        selectedOptionsArr.forEach((opt, i) => {
            selectedDetailCmp.push(<SelectedDetail key={i} name={options[opt].name} price={options[opt].price}
                onClick={() => { this.hSDetailClick(opt, i); }} onChange={(value) => { this.hSDetailChange(opt, value) }} />);
        });

        return (
            <div id="pdt-detail">
                <div className="img">
                    <img src={this.props.productInfo.imgUrl} />
                </div>
                <div className="desc">
                    <h1>{this.props.productInfo.title}</h1>
                    <p>{this.props.productInfo.description}</p>
                </div>
                <div className="select-sum">
                    <div className="select clearfix">
                        <div className="title">옵션:</div>
                        <select dir="rtl" className="opt-select" onChange={this.hSelectChange}>{optionTags}</select>
                    </div>
                    <div className="detail-list">
                        {selectedDetailCmp}
                    </div>
                    <div className="sum clearfix">
                        <span className="total-title">합계:</span>
                        <span className="total-price">{this.state.totalPrice}원</span>
                    </div>
                </div>
                <div className="btns">
                    <button onClick={this.hAddtoCart}>장바구니에 담기</button>
                    <button onClick={this.hBuy}>바로 구매하기</button>
                    <button onClick={this.hCancel}>상품 리스트 보기</button>
                </div>
            </div>
        );
    }
}

class SelectedDetail extends React.Component {
    constructor(props) {
        super(props);
        this.hChange = this.hChange.bind(this);
    }

    hChange(evt) {
        this.props.onChange(evt.target.value);
    }

    componentDidMount() {
        this.props.onChange("1");
    }

    render() {
        return (
            <div className="selected-detail clearfix">
                <div className="name">{this.props.name}</div>
                <div className="num">
                    <input type="number" defaultValue="1" min="1" max="100" onChange={this.hChange} />
                    <span className="price">{this.props.price}원</span>
                    <button onClick={this.props.onClick}><i class="fas fa-times"></i></button>
                </div>
            </div>
        );
    }
}

// https://firebase.google.com/docs/database/security/quickstart
function realtimeDBFB() {
    let database = firebase.database();
    // log('database:', database.app.options_);

    // set()
    // database.ref('products/product6').set({ title: 'title', description: 'description' }).catch((err) => log(err));
    // on()
    // database.ref('users/' + 'rcode').on('value', (snapshot) => {});
    // database.ref('products').once('value').then((snapshot) => {}).catch();
}

// https://firebase.google.com/docs/storage/security/start
async function storageFB() {
    // Upload file
    // https://firebase.google.com/docs/storage/web/upload-files
    // let file = fileFB.files[0]; // file instanceof Blob: true

    // CORS Configuration
    // https://firebase.google.com/docs/storage/web/download-files
}

function functionsFB() {
    let functions = firebase.functions();
    // log('functions', functions);

    let addMsg = firebase.functions().httpsCallable('addMsg');
    addMsg({ text: "hellofunc" }).then(function (result) {
        // Read result of the Cloud Function.
        log('sanitizedMessage', result.data.text);
    }).catch(err => log(err));
}

g_firebaseLoaded = true;
if (g_onLoad) {
    log('firebase loaded late.')
    loadFBSDK();
}