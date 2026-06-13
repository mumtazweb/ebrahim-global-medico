document.addEventListener("DOMContentLoaded", function () {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var navMenu = document.querySelector("[data-nav-menu]");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function () {
            var isOpen = navMenu.classList.toggle("is-open");
            navToggle.classList.toggle("is-open", isOpen);
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    document.querySelectorAll("[data-dropdown-toggle]").forEach(function (toggle) {
        toggle.addEventListener("click", function () {
            var parent = toggle.closest(".nav-dropdown");
            if (parent) {
                parent.classList.toggle("is-open");
            }
        });
    });

    document.querySelectorAll("[data-contact-toggle]").forEach(function (toggle) {
        toggle.addEventListener("click", function (event) {
            event.stopPropagation();
            var parent = toggle.closest("[data-contact-menu]");
            if (parent) {
                var isOpen = parent.classList.toggle("is-open");
                toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            }
        });
    });

    document.addEventListener("click", function () {
        document.querySelectorAll("[data-contact-menu].is-open").forEach(function (menu) {
            menu.classList.remove("is-open");
            var toggle = menu.querySelector("[data-contact-toggle]");
            if (toggle) {
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    });

    document.querySelectorAll("[data-faq-toggle]").forEach(function (button) {
        button.addEventListener("click", function () {
            var item = button.closest(".faq-item");
            if (item) {
                item.classList.toggle("is-open");
            }
        });
    });

    var slider = document.querySelector("[data-country-slider]");
    var prev = document.querySelector("[data-slider-prev]");
    var next = document.querySelector("[data-slider-next]");

    if (slider && prev && next) {
        var slideBy = function (direction) {
            var card = slider.querySelector(".country-card");
            var amount = card ? card.getBoundingClientRect().width + 16 : 280;
            slider.scrollBy({ left: amount * direction, behavior: "smooth" });
        };

        prev.addEventListener("click", function () {
            slideBy(-1);
        });

        next.addEventListener("click", function () {
            slideBy(1);
        });
    }

    var backToTop = document.querySelector("[data-back-to-top]");
    if (backToTop) {
        window.addEventListener("scroll", function () {
            backToTop.classList.toggle("is-visible", window.scrollY > 450);
        });

        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    var filterForm = document.querySelector("[data-university-filter]");
    if (filterForm) {
        var fields = filterForm.querySelectorAll("[data-filter-field]");
        var cards = document.querySelectorAll(".filter-results .university-card");
        var emptyState = document.querySelector("[data-filter-empty]");

        var filterCards = function () {
            var values = {};
            fields.forEach(function (field) {
                values[field.name] = field.value;
            });

            var visibleCount = 0;
            cards.forEach(function (card) {
                var matches = true;
                if (values.country && card.dataset.country !== values.country) matches = false;
                if (values.fee && card.dataset.fee !== values.fee) matches = false;
                if (values.duration && card.dataset.duration !== values.duration) matches = false;
                if (values.medium && card.dataset.medium !== values.medium) matches = false;

                card.style.display = matches ? "" : "none";
                if (matches) visibleCount++;
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visibleCount === 0);
            }
        };

        fields.forEach(function (field) {
            field.addEventListener("change", filterCards);
        });
    }

    document.querySelectorAll("[data-validate-form]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var invalid = form.querySelector(":invalid");
            if (invalid) {
                event.preventDefault();
                invalid.focus();
                invalid.reportValidity();
                return;
            }

            var formType = form.getAttribute("data-whatsapp-form");
            if (formType) {
                event.preventDefault();

                var formData = new FormData(form);
                var lines = [
                    "Hello Global Medico Admissions,",
                    formType === "apply" ? "I want to apply for MBBS Abroad counselling." : "I want a call back for MBBS Abroad counselling.",
                    "",
                    "Name: " + (formData.get("name") || ""),
                    "Phone: " + (formData.get("phone") || "")
                ];

                if (formData.get("whatsapp")) lines.push("WhatsApp: " + formData.get("whatsapp"));
                if (formData.get("email")) lines.push("Email: " + formData.get("email"));
                if (formData.get("neet_status")) lines.push("NEET Status: " + formData.get("neet_status"));
                if (formData.get("country_interest")) lines.push("Preferred Country: " + formData.get("country_interest"));
                if (formData.get("budget_range")) lines.push("Budget Range: " + formData.get("budget_range"));
                if (formData.get("message")) lines.push("Message: " + formData.get("message"));

                var base = window.GME_WHATSAPP_BASE || "https://wa.me/918617459702";
                var url = base + "?text=" + encodeURIComponent(lines.join("\n"));
                window.open(url, "_blank", "noopener");
                window.location.href = "success.html";
            }
        });
    });
});
