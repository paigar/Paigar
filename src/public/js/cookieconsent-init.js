var cc = initCookieConsent();

cc.run({
	current_lang: "es",
	autoclear_cookies: true,
	cookie_name: "cc_cookie",
	cookie_expiration: 365,
	force_consent: true,
	autorun: window.location.pathname !== "/uso-de-cookies/",

	gui_options: {
		consent_modal: {
			layout: "cloud",
			position: "middle center",
			transition: "zoom",
		},
		settings_modal: {
			layout: "bar",
			position: "left",
			transition: "slide",
		},
	},

	onChange: function (cookie, changed_preferences) {},

	languages: {
		es: {
			consent_modal: {
				title: "USO DE COOKIES",
				description:
					'Paigar utiliza cookies propias y de terceros para posibilitar y mejorar tu experiencia de navegación, mostrarte publicidad personalizada así como para realizar análisis estadísticos. Puedes elegir si aceptas las cookies utilizadas por Paigar, o puedes dedicar unos minutos a personalizarlas haciendo click en \'Personalizar\'. <br /><br />Obtendrás más información en nuestra <a href="/uso-de-cookies" class="cc-link">política de cookies</a>.',
				primary_btn: {
					text: "Aceptar y seguir navegando",
					role: "accept_all",
				},
				secondary_btn: {
					text: "Personalizar",
					role: "settings",
				},
			},
			settings_modal: {
				title: "Configuración de Cookies",
				save_settings_btn: "Guardar configuración",
				accept_all_btn: "Aceptar todo",
				reject_all_btn: "Rechazar todo",
				close_btn_label: "Cerrar",
				cookie_table_headers: [
					{ col1: "Nombre" },
					{ col2: "Dominio" },
					{ col3: "Descripción" },
				],
				blocks: [
					{
						title: "La protección de tus datos es nuestra prioridad",
						description:
							"Paigar utiliza cookies propias y de terceros para posibilitar y mejorar tu experiencia de navegación, mostrarte publicidad personalizada así como para realizar análisis estadísticos.",
					},
					{
						title: "Cookies estrictamente necesarias",
						description:
							"Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan, incluyendo aquellas que el editor utiliza para permitir la gestión y operativa de la página web y habilitar sus funciones y servicios.",
						toggle: {
							value: "necessary",
							enabled: true,
							readonly: true,
						},
					},
					{
						title: "Cookies estadísticas",
						description:
							"Las cookies estadísticas ayudan a los propietarios de páginas web a comprender cómo interactúan los visitantes con esas páginas, reuniendo y proporcionando información de forma anónima.",
						toggle: {
							value: "analytics",
							enabled: false,
							readonly: false,
						},
						cookie_table: [
							{
								col1: "^_ga",
								col2: "www.paigar.es",
								col3: "Registra una identificación única que se utiliza para generar datos estadísticos acerca de cómo utiliza el visitante el sitio web. Es de tipo HTTP y caduca a los dos años.",
								is_regex: true,
							},
							{
								col1: "_gat",
								col2: "www.paigar.es",
								col3: "Utilizado por Google Analytics para controlar la tasa de peticiones. Es de tipo HTTP y caduca en un día.",
							},
							{
								col1: "_gid",
								col2: "www.paigar.es",
								col3: "Registra una identificación única que se utiliza para generar datos estadísticos acerca de cómo utiliza el visitante el sitio web. Es de tipo HTTP y caduca en un día.",
							},
						],
					},
					{
						title: "Cookies de marketing",
						description:
							"Las cookies de marketing se utilizan para rastrear a los visitantes en las páginas web. La intención es mostrar anuncios relevantes y atractivos para el usuario individual, y por lo tanto, más valiosos para los editores y terceros anunciantes.",
						toggle: {
							value: "marketing",
							enabled: false,
							readonly: false,
						},
						cookie_table: [
							{
								col1: "_fbp",
								col2: "www.paigar.es",
								col3: "Utilizada por Facebook para proporcionar una serie de productos publicitarios, como pujas, en tiempo real de terceros anunciantes. Es de tipo HTTP y caduca a los tres meses.",
								is_regex: true,
							},
							{
								col1: "_gcl_au",
								col2: "www.paigar.es",
								col3: "Utilizada por Google AdSense para experimentar con la eficiencia publicitaria a través de las webs usando sus servicios. Es de tipo HTTP y caduca a los tres meses.",
							},
							{
								col1: "fr",
								col2: "www.paigar.es",
								col3: "Utilizada por Facebook para proporcionar una serie de productos publicitarios como pujas en tiempo real, de terceros anunciantes. Es de tipo HTTP y caduca a los tres meses.",
							},
						],
					},
					{
						title: "Más información",
						description:
							'Puedes obtener más información en nuestra <a href="/uso-de-cookies" class="cc-link">política de cookies</a>.',
					},
				],
			},
		},
	},
});
