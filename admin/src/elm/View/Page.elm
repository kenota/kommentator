module View.Page exposing (ActivePage(..), layout)

import Html exposing (..)
import Html.Attributes exposing (..)
import Route exposing (Route)


type ActivePage
    = Other
    | Home
    | About
    | Setup


{-| Take a page's Html and layout it with a header and footer.
isLoading can be used to slow loading during slow transitions
-}
layout : ActivePage -> Html msg -> Html msg
layout page content =
    div []
        [ viewHeader page
        , content
        , viewFooter
        ]



{-

   <nav class="navbar" role="navigation" aria-label="main navigation">
     <div class="navbar-brand">
       <a class="navbar-item" href="https://bulma.io">
         <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
       </a>

       <div class="navbar-burger">
         <span></span>
         <span></span>
         <span></span>
       </div>
     </div>
   </nav>
-}


viewHeader : ActivePage -> Html msg
viewHeader page =
    nav [ class "navbar" ]
        [ div [ class "navbar-brand" ]
            [ a [ Route.href Route.Home, class "navbar-item" ]
                [ text "Kommentator" ]
            , a [ Route.href Route.About, class "navbar-item" ]
                [ text "About" ]
            , a [ Route.href Route.Setup, class "navbar-item" ]
                [ text "Setup" ]
            ]
        , hr [] []
        ]


viewFooter : Html msg
viewFooter =
    footer []
        [ div [] []
        ]
