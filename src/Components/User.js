import React from 'react';
import user from "../Assets/images/user.jpg";
import { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import download from 'downloadjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';



function User() {
    axios.defaults.withCredentials = true;

    const loginemail = localStorage.getItem("loginemail")
    const cookies = new Cookies();

    const [username, setUsername] = useState();
    const [profileImage, setProfileImage] = useState();
    const [fullname, setFullname] = useState([]);
    const [companyname, setCompanyname] = useState();
    const [title, setTitle] = useState();
    const [website, setWebsite] = useState();
    const [number, setNumber] = useState();
    const [email, setEmail] = useState();
    const [linkdin, setLinkdin] = useState();
    const [facebook, setFacebook] = useState();
    const [instagram, setInstagram] = useState();
    const [errmsg, setErrmsg] = useState();
    const [responsedata, setResponsedata] = useState([]);

    const [qrValue, setQrValue] = useState();
    const [qrfullname, setFullqrname] = useState();
    const [qrcompanyname, setQRCompanyname] = useState();
    const [qrUsername, setQrUsername] = useState();
    const [isVisible, setIsvisible] = useState(null);
    const qrCodeRef = useRef(null);
    const redirect = useNavigate();

    const handleLogout = () => {
        // Clear the stored token from cookies
        cookies.remove("token");
        window.localStorage.removeItem("loginemail");

        // Redirect to the login page or any other desired page
        redirect("/login");
    };

    //API TO SEND DATA TO DB FOR UPDATE
    const isValidURL = (url) => {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlRegex.test(url);
    };


    const handleSocialMediaChange = (e, socialMedia) => {
        const enteredURL = e.target.value.trim();
        if (isValidURL(enteredURL)) {
            switch (socialMedia) {
                case 'website':
                    setWebsite(enteredURL);
                    break;
                case 'linkdin':
                    setLinkdin(enteredURL);
                    break;
                case 'facebook':
                    setFacebook(enteredURL);
                    break;
                case 'instagram':
                    setInstagram(enteredURL);
                    break;
                default:
                    break;
            }
            setErrmsg('');
        } else {
            setErrmsg(`Enter a valid ${socialMedia === 'linkdin' ? 'LinkedIn' : socialMedia} URL`);
        }
    };
    


    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file != null) {
            setProfileImage(URL.createObjectURL(file));
        }
        else {
            setProfileImage(URL.createObjectURL(profileImage));
        }

        const profileImageContainer = document.getElementById('imag');
        // Check if a file is selected
        if (event.target.files.length > 0) {
            // Clear previous content
            profileImageContainer.innerHTML = '';
            const img = document.createElement('img');
            img.src = URL.createObjectURL(event.target.files[0]);
            profileImageContainer.appendChild(img);
        }
    };


    const handleSubmit = async (e) => {
       

        const file = document.getElementById('getpic').files[0];

        if (
            !profileImage ||
            !username ||
            !fullname ||
            !companyname ||
            !title ||
            !website ||
            !number ||
            !email ||
            !linkdin ||
            !facebook ||
            !instagram
        ) {
            setErrmsg("Enter Full Details");
            return;
        }
        else {
            try {
                const formData = new FormData();

                formData.append('username', username);
                formData.append('profileImage', file);
                formData.append('fullname', fullname);
                formData.append('companyname', companyname);
                formData.append('title', title);
                formData.append('website', website);
                formData.append('number', number);
                formData.append('email', email);
                formData.append('linkdin', linkdin);
                formData.append('facebook', facebook);
                formData.append('instagram', instagram);
                formData.append('loginemail', loginemail);

                const response = await axios.post("http://localhost:2000/update", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                });

                if (response.status === 200) {
                    setErrmsg("Data Submitted Successfully");
                    // console.log("Data Submitted Successfully");
                    const user_name = username.split(' ')[0];
                    const Website = `digicardvault.com/#/digitalcard/${user_name}`;
                    // const fullname = fullname;
                    // e.preventDefault();
                    setQrUsername(user_name);
                    setQrValue(Website);
                    setFullqrname(fullname);
                    setQRCompanyname(companyname);
                    setIsvisible(true);
                }
            } catch (error) {
                // e.preventDefault();

                if (error.response && error.response.status === 400) {
                    setErrmsg(error.response.data.message);
                } else {
                    setErrmsg("Something went wrong");
                    console.error("Error: ", error);
                }
            }
        }
    };

    const handleDownload = () => {
        // console.log("qr download ");

        const qrCodeContainer = qrCodeRef.current;

        if (qrCodeContainer) {
            const captureOptions = {
                useCORS: true,
                width: qrCodeContainer.offsetWidth,
                height: qrCodeContainer.offsetHeight,
                scrollY: -window.scrollY,
            };

            const clonedContainer = qrCodeContainer.cloneNode(true);
            const nameElement = clonedContainer.querySelector('.q-name');
            nameElement.style.textAlign = 'center';

            html2canvas(qrCodeContainer, captureOptions)
                .then((canvas) => {

                    const dataUrl = canvas.toDataURL('image/png');


                    download(dataUrl, 'qrcode.png', 'image/png');
                })
                .catch((error) => {
                    console.error('Error capturing QR code:', error);
                });
        }
    };

    // API TO FETCH DATA FROM DB
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {

        // useEffect(() => {
        const token = cookies.get('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            redirect("/login");
        }
        // }, []);
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:2000/fetchdata", {
                    params: {
                        loginemail: loginemail,
                    }
                });

                if (response.status === 200) {
                    setResponsedata(response.data);
                    // console.log("Response object:", response);
                    // console.log("Data object:", response.data);
                    setFullname(response.data[0].Name);
                    setUsername(response.data[0].User_Name);
                    setEmail(response.data[0].Email);
                    setWebsite(response.data[0].Website_Link);
                    setInstagram(response.data[0].Instagram_Link);
                    setFacebook(response.data[0].Facebook_Link);
                    setLinkdin(response.data[0].Linkdin_Link);
                    setNumber(response.data[0].Number);
                    setTitle(response.data[0].Title);
                    setCompanyname(response.data[0].Company);
                    setProfileImage(response.data[0].Profile_Pic);

                    const Website = `digicardvault.com/#/digitalcard/${response.data[0].User_Name}`;
                    setQrUsername(response.data[0].User_Name);
                    setQrValue(Website);
                    setFullqrname(response.data[0].Name);
                    setQRCompanyname(response.data[0].Company);
                    setIsvisible(true);
                }

            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.log("Error:", error.response.data);
                } else {
                    console.error("Error:", error);
                }
            }
        };

        // Call fetchData when the component mounts
        fetchData();
    }, []);

    // Empty dependency array ensures that useEffect runs only once when the component mounts
    return (
        <div className="c-login-dive c-new-sign-up" >
            <div className='c-mobile_body c-profile_page'>
                <div>
                    <div className="star-field">
                        <div className="layer"></div>
                        <div className="layer"></div>
                        <div className="layer"></div>
                    </div>
                </div>
                <div>
                    <button className='c-btn-logout' onClick={handleLogout}>LogOut</button>
                    {/* <button className='c-btn-logout' onClick={handleDownload}>Download QR Code</button> */}
                    {/* <button onClick={handleDownload} type='submit'>Download QR Code</button> */}

                    <div className="c-login_des c-profile_des">
                        <form >

                            <div className="c-mobile_text">
                                <h2>Welcome Back </h2>
                                <p>Update Your Details</p>
                            </div>
                            <div className="c-input-box">

                                <div id="profile-upload">
                                    <div className="hvr-profile-img">
                                        <input
                                            accept='image/*'
                                            type="file"
                                            name="logo"
                                            id="getpic"
                                            className="upload w180"
                                            title="Dimensions 180 X 180"
                                            onChange={(e) => {
                                                handleImageChange(e);
                                                // setProfileImage(e.target.files);
                                            }}
                                            required
                                        />
                                        <i className="fa fa-camera"></i>
                                    </div>
                                    <div id="imag" >
                                        <img src={`/Assets/profile/${profileImage}`} />
                                    </div>
                                </div>

                                <div className='c-profile_from'>
                                    <div className='c-profile_input'>
                                        <label htmlFor="username"><b>User Name</b></label>
                                        <input type="text" placeholder="Enter User Name" name="username" value={username} onChange={(e) => { setUsername(e.target.value) }} readOnly />
                                    </div>
                                    <div className='c-profile_input'>
                                        <label htmlFor="uname"><b>Full Name</b></label>
                                        <input type="text" placeholder="Enter Full Name" name="fullname" value={fullname} onChange={(e) => { setFullname(e.target.value) }} required />
                                    </div>
                                    <div className='c-profile_input'>
                                        <label htmlFor="uname"><b>Company Name</b></label>
                                        <input type="text" placeholder="Enter Company Name" name="company" value={companyname} onChange={(e) => { setCompanyname(e.target.value) }} required />
                                    </div>
                                    <div className='c-profile_input'>
                                        <label htmlFor="uname"><b>Title</b></label>
                                        <input type="text" placeholder="Enter Title" name="title" value={title} onChange={(e) => { setTitle(e.target.value) }} required />
                                    </div>
                                    <div className='c-profile_input'>
                                        <label htmlFor="website"><b>Website URL</b></label>
                                        <input type="url" placeholder="Enter Website URL" name="website" value={website} onChange={(e) => handleSocialMediaChange(e, 'website')} required />

                                    </div>
                                    <div className='c-profile_input'>
                                        <label htmlFor="uname"><b>Phone Number</b></label>
                                        <input type="tel" placeholder="Enter Phone Number With Country Code" name="number" value={number} onChange={(e) => { setNumber(e.target.value) }} required />
                                    </div>
                                    <div className='c-profile_input'>
                                        <label htmlFor="uname"><b>Email</b></label>
                                        <input type="email" placeholder="Enter Email" name="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required />

                                    </div>
                                    <div className='c-profile_input'>
                                        <label htmlFor="linkdin"><b>LinkedIn URL</b></label>
                                        <input type="url" placeholder="Enter LinkedIn URL" name="linkdin" value={linkdin} onChange={(e) => handleSocialMediaChange(e, 'linkdin')} required />

                                    </div>
                                    <div className='c-profile_input'>
                                        <label htmlFor="facebook"><b>Facebok URL</b></label>
                                        <input type="url" placeholder="Enter Facebok URL" name="facebook" value={facebook} onChange={(e) => handleSocialMediaChange(e, 'facebook')} required />
                                    </div>
                                    <div className='c-profile_input'>
                                        <label htmlFor="instagram"><b>Instagram URL</b></label>
                                        <input type="url" placeholder="Enter Instagram URL" name="instagram" value={instagram} onChange={(e) => handleSocialMediaChange(e, 'instagram')} required />
                                    </div>
                                </div>
                                {errmsg && (
                                    <p style={{ color: "red" }}>
                                        {<p style={{ color: "red" }}>{setErrmsg}</p>
                                        }
                                    </p>
                                )}
                                {errmsg && (
                                    <p style={{ color: "red" }}>{errmsg}</p>
                                )}
                                <div className='c-btn_user'>
                                    {/* <button onClick={handleUpdate} >
                                        Update Data
                                    </button> */}
                                    <button onClick={handleSubmit} >
                                        Save Data & Generate QR Code
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {isVisible && (
                    <div>
                        <div className='c-card' ref={qrCodeRef}>
                            <div className='c-card-b'>
                                <div>
                                    <p className='q-name'>{qrcompanyname}</p>
                                    <QRCode
                                        className='c-card_qr'
                                        value={qrValue}
                                        // style={{ display: 'block', margin: '0 auto' }}
                                        onLoad={() => handleDownload()}
                                    />
                                    <div className='c-card_des'>
                                        <p><span>{qrfullname}</span></p>
                                        <Link to={`/digitalcard/${qrUsername}`}>
                                            <p><span>{qrValue}</span></p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='qr_download'>
                            <button onClick={handleDownload} type='submit'>Download QR Code</button>
                        </div>
                    </div>
                )}
            </div >
        </div >
    );
}

export default User;

