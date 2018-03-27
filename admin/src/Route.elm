module Route exposing (Route(..), href, modifyUrl, fromLocation)

import Navigation exposing (Location)
import Html exposing (Attribute)
import Html.Attributes as HtmlAttrs
import UrlParser as Url exposing ((</>), Parser, oneOf, parseHash, s, string)


-- ROUTING --


type Route
    = Home
    | Login


route : Parser (Route -> a) a
route =
    oneOf
        [ Url.map Home (s "")
        , Url.map Login (s "login")
        ]


routeToString : Route -> String
routeToString route =
    let
        path =
            case route of
                Home ->
                    ""

                Login ->
                    "login"
    in
        "#/" ++ path


href : Route -> Attribute msg
href route =
    HtmlAttrs.href (routeToString route)


modifyUrl : Route -> Cmd msg
modifyUrl =
    routeToString >> Navigation.modifyUrl


fromLocation : Location -> Maybe Route
fromLocation location =
    if String.isEmpty location.hash then
        Just Home
    else
        parseHash route location
