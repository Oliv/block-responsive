# block-responsive

jquery.blockResponsive
===========

Repositionnement de blocs à la volée en fonction de breakpoints


Prérequis
----------

Inclure jQuery
Copier le répertoire du script dans js du projet

Inclure le script

    <script src="js/jquery.blockResponsive/jquery.blockResponsive.js"></script>


Utilisation
----------

Appliquer le script sur les éléments souhaités

    <script>
        (function($) {
            $(document).ready(function() {
                $('.js-block-responsive').blockResponsive();
            });
        })(jQuery);
    </script>

L'élément ciblé prend autant d'attributs data que de breakpoints définis.

    <div class="blockResponsive"
        data-mobile="<selecteur>"
        data-tablet="<selecteur>"
        data-desktop="<selecteur>"
        data-wide="<selecteur>">
        ...
    </div>

Chaque attribut data prend pour valeur un sélecteur CSS, plus un placement par rapport à l'élément ciblé par le sélecteur :

    data-<breakpoint>="<selecteur>::<position>"

Positions disponibles :

    first (insertion dans l'élément, en premier)
    inside / last (insertion dans l'élément, en dernier)
    before (insertion avant l'élément)
    after (insertion après l'élément)


Activer le log
----------

Pour activer le log (désactivé par défaut) :

    <script>
        (function($) {
            $(document).ready(function() {
                $('.js-block-responsive').blockResponsive({
                    log: true
                });
            });
        })(jQuery);
    </script>


Redéfinir les breakpoints
----------

Breakpoints par défaut :

    breakpoints: {
        mobile:  [null, 500],
        tablet:  [500,  800],
        desktop: [800,  1200],
        wide:    [1200, null]
    }

Pour redéfinir les breakpoints, passer en paramètre à la fonction les nouveaux breakpoints lors de son appel :

    <script>
        (function($) {
            $(document).ready(function() {
                $('.js-block-responsive').blockResponsive({
                    breakpoints: {
                        mobile:  [null, 700],
                        tablet:  [700,  1000],
                        desktop: [1000, 1200],
                        wide:    [1200, null]
                    }
                });
            });
        })(jQuery);
    </script>

Il est possible de supprimer des breakpoints s'ils ne sont pas cohérents avec le projet :

    <script>
        (function($) {
            $(document).ready(function() {
                $('.js-block-responsive').blockResponsive({
                    breakpoints: {
                        mobile:  [null, 800],
                        desktop: [800,  null]
                    }
                });
            });
        })(jQuery);
    </script>

Dans ce cas mettre uniquement les attributs data correspondants


Classes ajoutées
----------

A chaque repositionnement (y compris le positionnement initial au chargement de la page),
une classe du nom du breakpoint correspondant est ajouté à l'élément ciblé.


Evènements
----------

A chaque repositionnement (y compris le positionnement initial au chargement de la page),
deux évènements sont appliqués à l'élément ciblé :

* blockMoveStart
* blockMoveComplete

Pour les deux évènements les paramètres appliqués à la fonction sont :

event : l'évènement javascript
this : le script blockResponsive
element : l'élément (jQuery) sur lequel est appliqué le script
cible : l'élément (jQuery) du sélecteur vers lequel l'élément sera/a été déplacé
pos : l'attribut data complet parsé, un objet contenant selector et position
oldBreakpoint : le nom de l'ancien breakpoint
breakpoint : le nom du nouveau breakpoint

Utilisation :

    $('.js-block-responsive').blockResponsive();

    $('.js-block-responsive').on('blockMoveStart', function(event, blockResponsive, element, cible, pos, oldBreakpoint, breakpoint) {
        console.log('Le bloc ', element, ' se déplace de l\'état ', oldBreakpoint, ' vers ', breakpoint, ' vers la cible ', cible);
    });

    $('.js-block-responsive').on('blockMoveComplete', function(event, blockResponsive, element, cible, pos, oldBreakpoint, breakpoint) {
        console.log('Le bloc ', element, ' s\'est déplacé de l\'état ', oldBreakpoint, ' vers ', breakpoint, ' vers la cible ', cible);
    });
