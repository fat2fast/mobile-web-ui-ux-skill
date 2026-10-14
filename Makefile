FIXTURE ?= order-dashboard

.DEFAULT_GOAL := help
.PHONY: help no-skill with-skill both all

help:
	@echo "======================================================================"
	@echo " Makefile: Hướng dẫn tạo project test đối chứng (Comparison Projects)"
	@echo " Skill: mobile-web-ui-ux-skill"
	@echo "======================================================================"
	@echo ""
	@echo "Mục đích:"
	@echo "  Tạo 2 bản sao độc lập ('no-skill' và 'with-skill') từ cùng một fixture"
	@echo "  để so sánh quyết định thiết kế mobile web UI/UX của AI coding agent."
	@echo ""
	@echo "Cú pháp:"
	@echo "  make <target> DEST=<đường-dẫn-thư-mục-cha> [FIXTURE=<tên-fixture>]"
	@echo ""
	@echo "Các targets khả dụng:"
	@echo "  both / all   Tạo cả 2 project 'no-skill' và 'with-skill' vào DEST"
	@echo "  no-skill     Chỉ tạo project baseline (không kèm skill)"
	@echo "  with-skill   Chỉ tạo project candidate (kèm skill tại .agents/skills/)"
	@echo "  help         Hiển thị bảng hướng dẫn này"
	@echo ""
	@echo "Tham số cấu hình:"
	@echo "  DEST         [Bắt buộc] Thư mục cha đã tồn tại (nằm ngoài skill repo)."
	@echo "               Lưu ý: Nếu chưa có thư mục, hãy tạo trước: mkdir -p <DEST>"
	@echo "  FIXTURE      [Tùy chọn] Tên fixture mẫu (mặc định: order-dashboard):"
	@echo "               - order-dashboard : Bảng đơn hàng desktop responsive"
	@echo "               - mobile-form     : Biểu mẫu form mobile phức tạp"
	@echo ""
	@echo "Các bước sử dụng khuyến nghị (Quick Start):"
	@echo "  1. Chuẩn bị thư mục đích:"
	@echo "     mkdir -p ~/work/mobile-ux-test"
	@echo ""
	@echo "  2. Tạo cả 2 dự án test (fixture mặc định order-dashboard):"
	@echo "     make both DEST=~/work/mobile-ux-test"
	@echo ""
	@echo "  3. Hoặc tạo với fixture mobile-form:"
	@echo "     make both DEST=~/work/mobile-ux-test FIXTURE=mobile-form"
	@echo ""
	@echo "  4. Cài dependencies cho từng project trước khi mở agent:"
	@echo "     cd ~/work/mobile-ux-test/no-skill && npm ci"
	@echo "     cd ~/work/mobile-ux-test/with-skill && npm ci"
	@echo "======================================================================"

both all:
	@test -n "$(DEST)" || { \
		echo "Lỗi: Chưa chỉ định tham số DEST!" >&2; \
		echo "Cách dùng: make $@ DEST=/duong-dan/thu-muc-cha [FIXTURE=order-dashboard|mobile-form]" >&2; \
		echo "Chạy 'make help' để xem hướng dẫn chi tiết." >&2; \
		exit 2; \
	}
	@$(MAKE) --no-print-directory no-skill DEST="$(DEST)" FIXTURE="$(FIXTURE)"
	@$(MAKE) --no-print-directory with-skill DEST="$(DEST)" FIXTURE="$(FIXTURE)"

no-skill with-skill:
	@test -n "$(DEST)" || { \
		echo "Lỗi: Chưa chỉ định tham số DEST cho target '$@'!" >&2; \
		echo "Cách dùng: make $@ DEST=/duong-dan/thu-muc-cha [FIXTURE=order-dashboard|mobile-form]" >&2; \
		echo "Chạy 'make help' để xem hướng dẫn chi tiết." >&2; \
		exit 2; \
	}
	@python3 scripts/create-comparison-project.py --dest "$(DEST)" --fixture "$(FIXTURE)" --condition "$@"
