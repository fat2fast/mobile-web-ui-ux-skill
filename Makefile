FIXTURE ?= order-dashboard

.PHONY: no-skill with-skill

no-skill with-skill:
	@test -n "$(DEST)" || { echo 'Usage: make $@ DEST=/absolute/destination [FIXTURE=order-dashboard|mobile-form]' >&2; exit 2; }
	@python3 scripts/create-comparison-project.py --dest "$(DEST)" --fixture "$(FIXTURE)" --condition "$@"
