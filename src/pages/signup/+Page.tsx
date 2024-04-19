import { Link } from '#/components/Link';
import React, { useState } from 'react';
// @ts-expect-error unpluginIcons imports like this
import IcOutlineCheck from '~icons/ic/outline-check';
// @ts-expect-error unpluginIcons imports like this
import IcBaselineArrowBackIos from '~icons/ic/baseline-arrow-back-ios';
import { siteNameWithBackSlash } from '../index/content';
import { Button } from '#/components/button';
import { checkHandle } from '#/supabase/handle';
import { trpc } from '#/trpc/client';

const ClaimLinkPage: React.FC = () => {
  const [userHandle, setUserHandle] = useState('');
  // const [phone, setPhone] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHandleAvailable, setIsHandleAvailable] = useState(false);
  const [isHandlePage, setIsHandlePage] = useState(true);

  const handleLinkChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9_.-]*$/;

    if (regex.test(event.target.value)) {
      setUserHandle(event.target.value.toLowerCase());
      await isValidLink(event.target.value);
    }
  };

  // const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPhone(event.target.value);
  // };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onBackClick = () => {
    setIsHandlePage(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle the link claim logic here
    // const signUpResp = await signUp(email, password);
    // const handleResp = await createHandle(userHandle, signUpResp.data.user.id);
    // Once we sign up, we send it to back end to process handle.
    try {
      const queryInput = {
        txId: '123',
        sourceChain: 'ergo',
        destChain: 'carcano',
        amount: 1000000,
        tokenType: 'erg',
        sourceAddress: '9hrT4Kt8R4NAJoYiHZ6Cnpo4BcGLA32S58UjckJSxAcRF1xUops',
        destChainAddress:
          'addr1q8zjxvnj9cqh2ernglzgem8c0kvvp7nlmtqvzztyevpx2h6fa3yr34tv9qgjvkyz3q2f9hqrycace02rfzqv8dwvq7zse2hp6c',
      };

      const handleResp = await trpc.main.create.mutate(queryInput);
      console.log('handle added:', handleResp);
      // const handleResp = await createHandle(userHandle, signUpResp.data.user.id);
    } catch (error) {
      console.error('Error adding handle:', error);
    }
  };

  const isValidLink = async (userHandle: string) => {
    // Implement your validation logic here
    // make sure handle is always lowercase
    // handle should only be able to have . or _
    await checkHandle(userHandle).then((response) => {
      if (response.data !== null && response.data.length === 0) {
        setIsHandleAvailable(true);
      } else {
        setIsHandleAvailable(false);
      }
    });
  };

  const renderHandlePage = () => {
    return (
      <>
        <h1 className="text-4xl font-bold mb-2">First, claim your unique link</h1>
        <p className="mb-6 text-gray-700">The good ones are still available!</p>
        <div className="flex items-center border-b border-gray-300 py-2 mb-4 px-2">
          <span className="text-gray-500">{siteNameWithBackSlash}@</span>
          <input
            type="text"
            className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 pr-2 leading-tight focus:outline-none h-8"
            value={userHandle}
            onChange={handleLinkChange}
            placeholder="your-name"
          />
          {isHandleAvailable && <IcOutlineCheck className="text-green-500 h-8 w-8" />}
        </div>
        <Button
          className="bg-black text-white text-base py-2 px-4 rounded"
          onClick={() => setIsHandlePage(false)}
          disabled={!isHandleAvailable}
          disabledClassName={'bg-gray-500 py-2 px-4 rounded'}
        >
          Grab my Link
        </Button>
        <div className="text-left pt-5">
          <span className="text-sm text-gray-600 mr-1">or</span>
          <Link href="/login" className="text-sm font-medium text-black-800 hover:text-black">
            Login
          </Link>
        </div>
      </>
    );
  };

  const renderUserDetailsPage = () => {
    return (
      <>
        <button onClick={onBackClick} className="w-7 justify-left mb-3 py-2 pr-2 rounded">
          <IcBaselineArrowBackIos className="h-6 w-6" />
        </button>
        <p className="mb-6 text-gray-700">
          {siteNameWithBackSlash}@{userHandle} is yours!
        </p>
        <h1 className="text-4xl font-bold mb-2">Let&apos;s create your account.</h1>
        <p className="mb-6 text-gray-700">We&apos;ll need your phone number and email for registration</p>
        <div className="flex items-center border-b border-gray-300 py-2 mb-4">
          <input
            type="text"
            id={'email'}
            className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 pr-2 leading-tight focus:outline-none"
            value={email}
            onChange={handleEmailChange}
            placeholder="email"
          />
        </div>
        <div className="flex items-center border-b border-gray-300 py-2 mb-4">
          <input
            type="password"
            className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 pr-2 leading-tight focus:outline-none"
            value={password}
            onChange={handlePasswordChange}
            placeholder="password"
          />
        </div>
        <button className="bg-black text-white text-base py-2 px-4 rounded hover:bg-gray-700" type="submit">
          Create Account
        </button>
      </>
    );
  };

  const renderPage = () => {
    if (isHandlePage) {
      return renderHandlePage();
    } else {
      return renderUserDetailsPage();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="max-w-xs w-full space-y-8">
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          {renderPage()}
        </form>
      </div>
    </div>
  );
};

export default ClaimLinkPage;
