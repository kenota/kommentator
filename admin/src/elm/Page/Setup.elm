module Page.Setup exposing (view, update, Model, Msg, init)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)


---- MODEL ----


type RecaptchaSetting
    = Disabled
    | Enabled String


type alias Model =
    { recaptcha : RecaptchaSetting
    }


init : Model
init =
    Model Disabled



-- UPDATE --


type Msg
    = ToggleRecaptcha


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ToggleRecaptcha ->
            case model.recaptcha of
                Disabled ->
                    ( { model | recaptcha = Enabled "" }, Cmd.none )

                Enabled _ ->
                    ( { model | recaptcha = Disabled }, Cmd.none )



-- VIEW --


viewRecaptchaToken : Model -> Html Msg
viewRecaptchaToken model =
    case model.recaptcha of
        Disabled ->
            div [] []

        Enabled token ->
            div [ class "field" ]
                [ label [ class "label" ] [ text "Recaptcha Token" ]
                , div [ class "control" ]
                    [ input [ class "input", placeholder "API token" ] []
                    , p [ class "help" ]
                        [ text "Get your token "
                        , a [ href "https://www.google.com/recaptcha/intro/", target "_blank" ] [ text " at recaptcha website" ]
                        ]
                    ]
                ]


view : Model -> Html Msg
view model =
    let
        recaptchaEnabled =
            case model.recaptcha of
                Disabled ->
                    False

                Enabled _ ->
                    True
    in
        div []
            [ section [ class "hero is-info" ]
                [ div [ class "hero-body" ]
                    [ div [ class "container" ]
                        [ h1 [ class "title" ] [ text "Setup" ]
                        , h2 [ class "subtitle" ] [ text "Thank you for installing Kommentator. Lets set it up." ]
                        ]
                    ]
                ]
            , section [ class "section" ]
                [ div [ class "container" ]
                    [ div [ class "columns" ]
                        [ div [ class "column is-half" ]
                            [ Html.form []
                                [ div [ class "field" ]
                                    [ label [ class "label" ] [ text "Url" ]
                                    , div [ class "control" ]
                                        [ input [ class "input", placeholder "https://mywebsite.com" ] []
                                        , p [ class "help" ] [ text "Address of the website where you will host the comments" ]
                                        ]
                                    ]
                                , div [ class "field" ]
                                    [ div [ class "control" ]
                                        [ label [ class "checkbox" ]
                                            [ input [ type_ "checkbox", onClick ToggleRecaptcha, checked recaptchaEnabled ] []
                                            , text (" " ++ "Enable ReCaptcha")
                                            ]
                                        ]
                                    ]
                                , viewRecaptchaToken model
                                , div [ class "field" ]
                                    [ div [ class "control" ]
                                        [ button [ class "button is-link" ] [ text "Submit" ] ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
