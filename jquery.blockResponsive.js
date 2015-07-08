(function($) {
    "use strict";

    $.eolasOptimizedResize = $.eolasOptimizedResize || (function() {

        var callbacks = [],
            running = false;

        // fired on resize event
        function resize() {

            if (!running) {
                running = true;

                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(runCallbacks);
                } else {
                    setTimeout(runCallbacks, 66);
                }
            }

        }

        // run the actual callbacks
        function runCallbacks() {

            callbacks.forEach(function(callback) {
                callback();
            });

            running = false;
        }

        // adds callback to loop
        function addCallback(callback) {

            if (callback) {
                callbacks.push(callback);
            }

        }

        return {
            // initalize resize event listener
            init: function(callback) {
                window.addEventListener('resize', resize);
                addCallback(callback);
            },

            // public method to add additional callback
            add: function(callback) {
                addCallback(callback);
            }
        }
    }());

    function viewport() {
        var e = window;
        var a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
    }

    /**
     * Fonction d'initialisation de l'objet
     *
     */
    var BlockResponsive = function(inst, options) {
        // Ids et objets
        this.container = inst;

        this.log('BlockResponsive instancié pour ', inst);

        // On récup les objets + options
        this.options = options;

        this.log('Breakoints définis', options.breakpoints);

        this.parameters();

        this.log('Lancement du onResize optimisé');

        $.eolasOptimizedResize.init($.proxy(this.run, this));
        this.run();

        return this;
    };

    /**
     * Fonctions de l'objet
     *
     */
    $.extend(BlockResponsive.prototype, {
        options:    {},
        positions: {},
        container: null,

        /**
         * Récupère les paramètres du conteneur
         *
         * @returns {Object} this chainable
         */
        parameters: function() {
            var element = $(this.container),
                data = element.data(),
                positions = this.positions;

            for (var i in this.options.breakpoints) {
                if (data[i] !== undefined) {
                    var arr = data[i].split('::');

                    if (arr.length) {
                        this.positions[i] = {
                            selector: arr.shift(),
                            position: arr.length ? arr.shift() : 'inside'
                        };
                    }
                }
            }

            this.log('Paramètres récupérés', this.positions);

            return this;
        },

        /**
         * Routine
         *
         * @returns none
         */
        run: function() {
            var size = viewport(),
                width = size.width;

            for (var i in this.options.breakpoints) {
                var breakpoint = this.options.breakpoints[i],
                    min = breakpoint[0] || 0,
                    max = breakpoint[1] || width + 1;

                if (width > min && width <= max && this.positions[i] !== undefined) {
                    this.move(i, this.positions[i]);
                }

            }
        },

        /**
         * Déplace la collection à la position du breakpoint
         *
         * @returns none
         */
        move: function(breakpoint, pos) {
            if (pos.selector !== undefined && pos.position !== undefined) {
                var cible = $(pos.selector),
                    element = $(this.container),
                    oldBreakpoint = element.data('current');

                if (cible.length && oldBreakpoint !== breakpoint) {
                    this.onPreMove.call(this, element, cible, pos, oldBreakpoint, breakpoint);
                }
            }
        },

        /**
         * Callback par défaut déclenché avant le déplacement
         *
         * @returns none
         */
        onPreMove: function(element, cible, pos, oldBreakpoint, breakpoint) {
            this.log('blockMoveStart déclenché', oldBreakpoint, '->', breakpoint);

            element.trigger('blockMoveStart', [this, element, cible, pos, oldBreakpoint, breakpoint]);

            element
                .removeClass(oldBreakpoint || breakpoint)
                .data('current', breakpoint)
                .addClass(breakpoint)
            ;

            element.animate({ opacity: 0 }, 150, $.proxy(function() {
                this.onMove.call(this, element, cible, pos, oldBreakpoint, breakpoint);
            }, this));
        },

        /**
         * Callback par défaut effectuant le déplacement en fonction de la position voulue
         *
         * @returns none
         */
        onMove: function(element, cible, pos, oldBreakpoint, breakpoint) {
            this.log('move déclenché', element, ' vers ', cible);

            switch (pos.position) {
                case 'first':
                    cible.prepend(element);
                    break;
                case 'inside':
                case 'last':
                    cible.append(element);
                    break;
                case 'before':
                    cible.before(element);
                    break;
                case 'after':
                    cible.after(element);
                    break;
                default:
                    throw new Error(pos.position + ' not defined');
                    break;
            }

            this.onPostMove.call(this, element, cible, pos, oldBreakpoint, breakpoint);
        },

        /**
         * Callback par défaut déclenché après le déplacement
         *
         * @returns none
         */
        onPostMove: function(element, cible, pos, oldBreakpoint, breakpoint) {
            element.animate({ opacity: 1 }, 150, $.proxy(function() {
                this.log('blockMoveComplete déclenché', oldBreakpoint, '->' , breakpoint);

                element.trigger('blockMoveComplete', [this, element, cible, pos, oldBreakpoint, breakpoint]);
            }, this));

        },

        /**
         * Logger
         *
         * @returns none
         */
        log: function(args) {
            if (this.options.log === true) {
                if (console !== undefined) {
                    console.info.apply(console, arguments);
                }
            }
        }
    });

    /**
     * Fonction d'instanciation des objets BlockResponsive, dispatch des options
     *
     * @param {Object} inst contexte de l'objet
     * @param {Object} options objet des options
     * @returns {Collection} l'objet instancié, l'objet existant
     */
    $.instancifyEolasBlockResponsive = function(inst, options) {
        return inst.eolasBlockResponsive || (inst.eolasBlockResponsive = new BlockResponsive(inst, options));
    }

    /**
     * BlockResponsive appelable par $(selector).eolasBlockResponsive({options});
     *
     * @param {Object} options objet des options
     * @returns {Objet} this chainable
     */
    $.fn.eolasBlockResponsive = function(options) {
        // Options par défaut
        var defaultOptions = {
            // Breakpoints
            breakpoints: {
                mobile:  [null, 500],
                tablet:  [500,  800],
                desktop: [800,  1200],
                wide:    [1200, null]
            },
            // Logger
            log: false
        };

        // Si collection non vide
        var obj = {};
        if (this.length) {
            this.each(function() {
                options = $.extend({}, defaultOptions, options);

                // Crée une nouvelle instance
                obj = $.instancifyEolasBlockResponsive(this, options);
            })
        }

        // On retourne la collection, ou directement l'instance de l'objet si un seul résultat est renvoyé
        return this.length === 1 && obj ? obj : this;
    };
})(jQuery);
