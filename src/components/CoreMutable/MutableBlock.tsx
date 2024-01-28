/**
 * ### 1. Mutable Block ###
 * Mutable card is the bread and butter of all of totoma.
 * Its the base card layer that is mutable in size. The
 * mutable size covers cases like this:
 * 1 block: [.]
 * 2 block Horizontal:  [..]
 * 3 block Horizontal: [...]
 * x block Horizontal: [..x..]
 *                    _
 * 2 block Vertical: [.]
 *                   [_]
 * x block Vertical: You get the idea
 * 2 Block Square: [..]
 *                [..]
 *
 * n x m block: [...n...]
 *              [...n...]
 *              [mmmnmmm]
 *              [...n...]
 *              [...n...]
 *
 * Functionality:
 * 1. Draggable across screen
 * 2. Expandable when hold on side or corner
 * 3. Able to inheir various kind of content like (with caveat):
 *      a. embed media
 *      b. React code
 *      c. Photos and words
 *      d. logo
 * 4. (Caveat) Content can be restricted based on card sizes
 *      For example, for a logo, the only allowed size are block
 *      or squares. Whereas media may be in any format.
 * 5. Clickable (with UI that indicates so)
 * 6. Configurable: Configurable here can be a little misdirected
 *      it basically means that users in the future should be able
 *      to create their own functionality and publish it to a store
 *      that other users can buy.
 *
 *
 * ### 2. Mutable Double Sided Block ###
 * Mutable double sided card is the same thing as mutable card
 * the only difference is that, it can be flipped to the back where
 * there are more content (like hidden content)
 *
 * For example, if a card allows services to be booked. When pressed,
 * instead of bringing them to a new page, the card flips and the rest
 * of the procedure continues
 *
 *
 * ### 3. Mutable Modal-ble Block ###
 * Similar in concept as the double sided block, a modal-ble card,
 * expands and fill up the screen and blocks the background.
 * This allows vieers of card to focus on the content and that
 * content only.
 */
