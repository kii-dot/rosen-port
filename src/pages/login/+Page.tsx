import React, { useState } from 'react';
import { Link } from '#/components/Link';
import { authenticateUserViaEmailPassword } from '#/supabase/auth';
import { getHandle } from '#/supabase/handle';
import { trpc } from '#/trpc/client';
import { query } from 'express';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Authentication logic goes here
    const queryInput = {
      sourceChain: 'ergo',
      destChain: 'cardano',
      amount: 1000000,
      tokenType: 'e0e0ba2f-ded6-4f7c-9037-1c1f61e144d9',
      sourceAddress: '9hrT4Kt8R4NAJoYiHZ6Cnpo4BcGLA32S58UjckJSxAcRF1xUops',
      destChainAddress:
        'addr1q8zjxvnj9cqh2ernglzgem8c0kvvp7nlmtqvzztyevpx2h6fa3yr34tv9qgjvkyz3q2f9hqrycace02rfzqv8dwvq7zse2hp6c',
    };

    console.log(queryInput);
    const handleResp = await trpc.main.containers.query({ limit: 100, index: 0 });
    console.log(handleResp);
    // const loginResp = await trpc.auth.login.mutate(queryInput);
    // if (loginResp?.id !== null && loginResp?.id) {
    // console.log('navigating to page');
    // window.location.href = `/@${loginResp?.id}`;
    // }
  };

  const renderHeading = () => {
    return (
      <div className={'mb-5'}>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in to your Totoma</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Good to have you back!</p>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <>
        {renderHeading()}
        <div className="flex items-center border-b border-gray-300 py-2 mb-4">
          <input
            type="text"
            id={'email'}
            className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 pr-2 leading-tight focus:outline-none"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email Address"
          />
        </div>
        <div className="flex items-center border-b border-gray-300 py-2 mb-4">
          <input
            type="password"
            className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 pr-2 leading-tight focus:outline-none"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
        </div>

        <button type="submit" className="bg-black text-white text-base py-2 px-4 rounded hover:bg-gray-700">
          Sign In
        </button>
        <div className="text-left pt-5">
          <span className="text-sm text-gray-600 mr-1">or</span>
          <Link href="/signup" className="text-sm font-medium text-black-800 hover:text-black">
            Signup
          </Link>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="max-w-xs w-full space-y-8">
        <form onSubmit={handleSubmit} className={'w-full flex flex-col'}>
          {renderContent()}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
