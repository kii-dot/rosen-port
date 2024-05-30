# Features Specifications

## User story:

- As a user, I would like to transfer my coins from one chain to another
- As a user, I would like to know if the container that my coins are in has been transferred or not
- As a user, I would like to know how much has each container been filled up
- As a user, I would like to know the event id from Rosen to keep track of the container that progress
- As a user, I would like to refund my coins from a container if I choose to
- As a user, I would like to have the option to pay extra to fill up the container fee. (Since the minimum fee is $10. Iif a container is filled up halfway through, and a user decides that he is willing to pay the $5 for the container to set sail right away, they can pay the $5 and the container can be bridged right away).

## Features

1.  Transfer tokens (from source chain to dest)
2.  Refund Tx (before funds are sent to rosen)

    - Regarding refund, we have to ensure that the user that is requesting a refund is the same user who created the tx to refund.
    - To ensure this is true, user have to send a service fee to refund.
    - This is good for 2 reasons:

    ```
    a. It prevents users from funding and then refunding

    b. It helps maintain the service
    ```

    User have to pay with the address they funded, therefore we are able to verify the user.

3.  Check containers and status
    - Source
    - Dest
    - Current Amount filled ($2000 == 100%)
