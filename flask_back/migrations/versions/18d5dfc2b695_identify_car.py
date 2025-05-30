"""Identify_car

Revision ID: 18d5dfc2b695
Revises: 25356fa39ec7
Create Date: 2025-05-26 10:22:55.341603

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '18d5dfc2b695'
down_revision = '25356fa39ec7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('identify_car',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('license_plate', sa.String(length=10), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=False),
    sa.Column('extra_info', sa.Text(), nullable=False),
    sa.Column('expire_date', sa.Date(), nullable=False),
    sa.Column('justification', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('identify_car')
    # ### end Alembic commands ###
