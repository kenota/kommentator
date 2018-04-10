module Main exposing (..)

import Html exposing (..)
import Json.Decode exposing (Value, field)
import Json.Encode
import Navigation exposing (Location)
import Page.About as About
import Page.Error as Error exposing (PageLoadError)
import Page.Home as Home
import Page.NotFound as NotFound
import Page.Setup as Setup
import Route exposing (..)
import View.Page as Page exposing (ActivePage)
import Util exposing ((=>))
import Http


---- MODEL ----


type alias ServerStatusReply =
    { intialized : Bool
    }


decodeServerStatusReply : Json.Decode.Decoder ServerStatusReply
decodeServerStatusReply =
    Json.Decode.map ServerStatusReply
        (field "intialized" Json.Decode.bool)


encodeServerStatusReply : ServerStatusReply -> Json.Encode.Value
encodeServerStatusReply record =
    Json.Encode.object
        [ ( "intialized", Json.Encode.bool <| record.intialized )
        ]


type ServerState
    = NonInitalized
    | Initalized


type alias Model =
    { page : Page
    }


type Page
    = Blank
    | NotFound
    | Error PageLoadError
    | Home Home.Model
    | About About.Model
    | Setup Setup.Model
    | Initializing



---- UPDATE ----


type Msg
    = SetRoute (Maybe Route)
    | HomeMsg Home.Msg
    | AboutMsg About.Msg
    | SetupMsg Setup.Msg
    | SetServerStatusReply (Result Http.Error ServerStatusReply)


setRoute : Maybe Route -> Model -> ( Model, Cmd Msg )
setRoute route model =
    case route of
        Nothing ->
            -- TODO Load 404 page not found
            ( model, Cmd.none )

        Just Route.Home ->
            ( { model | page = Home Home.init }, Cmd.none )

        Just Route.About ->
            ( { model | page = About About.init }, Cmd.none )

        Just Route.Setup ->
            ( { model | page = Setup Setup.init }, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    updatePage model.page msg model


updatePage : Page -> Msg -> Model -> ( Model, Cmd Msg )
updatePage page msg model =
    let
        toPage toModel toMsg subUpdate subMsg subModel =
            let
                ( newModel, newCmd ) =
                    subUpdate subMsg subModel
            in
                ( { model | page = (toModel newModel) }, Cmd.map toMsg newCmd )
    in
        case ( msg, page ) of
            -- Update for page transitions
            ( SetRoute route, _ ) ->
                setRoute route model

            -- Update for page specfic msgs
            ( HomeMsg subMsg, Home subModel ) ->
                toPage Home HomeMsg (Home.update) subMsg subModel

            ( AboutMsg subMsg, About subModel ) ->
                toPage About AboutMsg (About.update) subMsg subModel

            ( SetupMsg subMsg, Setup subModel ) ->
                toPage Setup SetupMsg (Setup.update) subMsg subModel

            ( _, NotFound ) ->
                -- Disregard incoming messages when we're on the
                -- NotFound page.
                model => Cmd.none

            ( _, _ ) ->
                -- Disregard incoming messages that arrived for the wrong page
                model => Cmd.none



---- VIEW ----


view : Model -> Html Msg
view model =
    let
        layout =
            Page.layout
    in
        case model.page of
            NotFound ->
                layout Page.Other NotFound.view

            Initializing ->
                Html.text "Initalizing..."
                    |> layout Page.Other

            Blank ->
                -- This is for the very intial page load, while we are loading
                -- data via HTTP. We could also render a spinner here.
                Html.text "Blank page"
                    |> layout Page.Other

            Error subModel ->
                Error.view subModel
                    |> layout Page.Other

            Home subModel ->
                Home.view subModel
                    |> layout Page.Home
                    |> Html.map HomeMsg

            About subModel ->
                About.view subModel
                    |> layout Page.About
                    |> Html.map AboutMsg

            Setup setupModel ->
                Setup.view setupModel
                    |> layout Page.Setup
                    |> Html.map SetupMsg



---- SUBSCRIPTIONS ----


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



----- REQUESTS -----


getServerStatus : Cmd Msg
getServerStatus =
    let
        url =
            "/api/v1/status"

        request =
            Http.get url decodeServerStatusReply
    in
        Http.send SetServerStatusReply request



---- PROGRAM ----


initialPage : Page
initialPage =
    Blank


init : Value -> Location -> ( Model, Cmd Msg )
init val location =
    ( { page = Initializing }, getServerStatus )



-- init val location =
--     setRoute (Route.fromLocation location)
--         { page = initialPage
--         }


main : Program Value Model Msg
main =
    Navigation.programWithFlags (Route.fromLocation >> SetRoute)
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
