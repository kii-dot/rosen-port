/**
 * ### Mutable Map ###
 * A mutable map is the chessboard of the system. It allows
 * MutableBlocks to live on it. The chessboard goal is to
 * store the data of the positions of the blocks, the size
 * of the blocks, and the type of blocks.
 *
 * $Core Functionality:
 * 1. Parse Json MutableMap object:
 *      The map has to be able to take a JSON object of MutableMap
 *      and parse it into a map and blocks.
 * 2. Render Json MutableMap object:
 *      The map must be able to take info of itself and generate
 *      a mutable map. This essentially means taking a state
 *      that holds the MutableMapObject and constantly updating it
 * 3. Validate Correctness of MutableMapObject:
 *      The map has to prevent error cases from happening, like
 *      overlapping of blocks, or blocks going out of frame.
 * 4. Configurable Sizes:
 *      This is not as important at the start, but moving into the
 *      future, we should be able to allow users to expand the size
 *      of their template
 * 5. Saveable Template:
 *      Users should be able to save their template and allow copy
 *      pasting or to sell them. This should be able to be done by
 *      saving the template of the MutableMapObject. However, all
 *      data should be cleared
 * 6. Mobile Mode:
 *      The template should be able to go into a mobile mode, it
 *      either moves the blocks in a good fashion, or allow users
 *      to move their blocks in mobile mode.
 */
