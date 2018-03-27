module Main exposing (..)

import Dom
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Navigation exposing (Location)
import Route exposing (Route)
import Json.Decode as Decode
import Page.Login as Login
import Http


type alias ServerConfig =
    { url : String }


type Model
    = Bootstrap
    | SetupRequired
    | LoginRequired


type Page
    = Blank
    | Login Login.Model


type PageState
    = Loaded Page
    | NavigatingFrom Page


type ServerState
    = Configured
    | NotConfigured


type Msg
    = None
    | ServerStatus (Result Http.Error String)



-- INIT


init : ( Model, Cmd Msg )
init =
    ( Bootstrap, getServerStatus )



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        None ->
            ( model, Cmd.none )

        ServerStatus (Ok status) ->
            ( model, Cmd.none )

        ServerStatus (Err _) ->
            ( model, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    case model of
        Bootstrap ->
            div [] [ text "boostrap" ]

        LoginRequired ->
            div [] [ text "loginRequired" ]

        SetupRequired ->
            div [] [ text "SetupRequired" ]



-- Requests


getServerStatus : Cmd Msg
getServerStatus =
    let
        url =
            "/api/v1/status"

        request =
            Http.get url decodeStatus
    in
        Http.send ServerStatus request



-- Decoders


decodeStatus : Decode.Decoder String
decodeStatus =
    Decode.at [ "status" ] Decode.string



-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- HTTP
-- update : Msg -> Model -> ( Model, Cmd Msg )
-- update msg model =
--     ( model, Cmd.none )
-- init : Maybe string -> ( Model, Cmd Msg )
-- init maybeString =
--     emptyModel ! []
-- view : Model -> Html Msg
-- view model =
--     text "hello"
-- -- setRoute : Maybe Route -> Model -> ( Model, Cmd Msg )
-- setRoute maybeRoute model =
--     case maybeRoute of
--         Nothing ->
--             ( { model | pageState = Blank }, Cmd.none )
-- -- MAIN --
-- main : Program Maybe Value Model Msg
-- main =
--     Navigation.programWithFlags (Route.fromLocation >> SetRoute)
--         { init = init
--         , view = view
--         , update = update
--         , subscriptions = \_ -> Sub.none
--         }


main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
