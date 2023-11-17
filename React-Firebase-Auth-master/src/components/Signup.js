import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha";

export default function Signup() {
  const usernameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  var pssvalObj = {
    capital:false,
    lower:false,
    number:false,
    strength:0 
    // strnght 0 = empty, 1 = weak, 2 = good, 3 = strong
    // at least level 2 is required
  }
  const [pssval, setpssval] = useState(pssvalObj);
  const [pwstn, setpwstn] = useState(0);
  const [captcha,setCaptcha] = useState(null);
  const history = useHistory()

  const handleCaptcha = (value)=>{
    setCaptcha(value);
  }


  const checkStrength = ()=>{

    var strength = 0;
    const cond1 = /^(?=.*[a-z]).{6,20}$/; 
    // at least one lower case
    const cond2 = /^(?=.*[A-Z]).{6,20}$/;
    // at least one upper case
    const cond3 = /^(?=.*[0-9]).{6,20}$/;
    // at least one number
    const cond4 = /[*@!#%&()^~{}]+/;

    const password =passwordRef.current.value;
    console.log(password);
    if (!password) {
      strength = 0;
    } else if (password.length < 6) {
     strength = 1;
    } else if (password.length >= 20) {
     strength = 1;
    } else if (!password.match(cond1)) {
     strength = 1;
    } else if (!password.match(cond2)) {
     strength = 1;
    } else if (!password.match(cond3)) {
     strength = 2;
    } else if (!password.match(cond4)){
      strength = 2
    } else if (password.length >= 10) {
      strength = 3;
    } else{
      strength = 2;
    }
    //  console.log(password.match(cond1));
     console.log("strength", strength);

     var newObj = pssval;
     newObj.strength = strength;
     setpssval(newObj);
     setpwstn(strength)
  }

  const passwordValidator = ()=>{
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    const cond1 = /^(?=.*[a-z]).{6,20}$/; 
    // at least one lower case
    const cond2 = /^(?=.*[A-Z]).{6,20}$/;
    // at least one upper case
    const cond3 = /^(?=.*[0-9]).{6,20}$/;
    // at least one number

    const password = passwordRef.current.value;
    if (!password) {
      return setError("password is required");
    } else if (password.length < 6) {
      return setError("Password must be longer than 6 characters")
      // errors.password = "Password must be longer than 6 characters";
    } else if (password.length >= 20) {
      return setError("Password must shorter than 20 characters")
      // errors.password = "Password must shorter than 20 characters";
    } else if (!password.match(cond1)) {
      return setError("Password must contain at least one lowercase")
      // errors.password = "Password must contain at least one lowercase";
    } else if (!password.match(cond2)) {
      return setError("Password must contain at least one capital letter");
      // errors.password = "Password must contain at least one capital letter";
    } else if (!password.match(cond3)) {
      return setError("Password must contain at least a number");
      // errors.password = "Password must contain at least a number";
    } else if(captcha==null){
      return setError("please confirm that you are not a robot");
    }else{
      return 1;
    }

  }

  //password validation
  // const cond1 = "/^(?=.*[a-z]).{6,20}$/";
  // const cond2 = "/^(?=.*[A-Z]).{6,20}$/";
  // const cond3 = "/^(?=.*[0-9]).{6,20}$/";
  // const password = inputValues.password;
  // if (!password) {
  //   errors.password = "password is required";
  // } else if (password.length < 6) {
  //   errors.password = "Password must be longer than 6 characters";
  // } else if (password.length >= 20) {
  //   errors.password = "Password must shorter than 20 characters";
  // } else if (!password.match(cond1)) {
  //   errors.password = "Password must contain at least one lowercase";
  // } else if (!password.match(cond2)) {
  //   errors.password = "Password must contain at least one capital letter";
  // } else if (!password.match(cond3)) {
  //   errors.password = "Password must contain at least a number";
  // } else {
  //   errors.password = "";
  // }


  async function handleSubmit(e) {
    e.preventDefault()

    // if (passwordRef.current.value !== passwordConfirmRef.current.value) {
    //   return setError("Passwords do not match")
    // }
    if(passwordValidator()!=1){
      return null;
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      history.push("/")
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }
console.log(-pwstn);
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
          <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={usernameRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required onChange={checkStrength} isValid={pwstn>1} isInvalid={pwstn==1}/>
              <Form.Control.Feedback tooltip 
                style={{position:"unset"}}
              >{pwstn>2?"strong":"good"}</Form.Control.Feedback>
              <Form.Control.Feedback tooltip 
                type="invalid"
                style={{position:"unset"}}
              >weak</Form.Control.Feedback>
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required 
              />
            </Form.Group>
            <Form.Group>
            <ReCAPTCHA
                sitekey="6LeuzdEgAAAAAH9JFMNlnOhk-rkkylR8ji2iP482"
                onChange={handleCaptcha}
              />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  )
}
